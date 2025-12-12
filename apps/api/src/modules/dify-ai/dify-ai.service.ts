import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import * as jwt from 'jsonwebtoken';

import {
  AiBadRequestException,
  AiInternalServerError,
  AiUnauthorizedException,
} from '@app/core/exception';

import { INJECTION_TOKEN } from '../../common/enums';
import { User } from '../../infrastructure/database/typeorm-nest/entities';

import {
  CreateAppDifyAiResponseDto,
  DEFAULT_AI_MODEL_CONFIG,
  DEFAULT_CREATE_APP_BODY,
  DifyAiAppModelConfigDto,
  DifyAiTokenPayloadDto,
  GetAppByIdDifyAiResponseDto,
  InternalApiDifyAiHeaderDto,
  LoginDifyAiResponseDto,
  LoginWithoutPasswordDifyAiResponseDto,
  UpdateAppModelConfigDifyAiResponseDto,
} from './dtos';
import {
  CreateAppDifyAiCommand,
  GetAppByIdDifyAiCommand,
  LoginDifyAiCommand,
  LoginWithoutPasswordDifyAiCommand,
  UpdateAppModelConfigDifyAiCommand,
} from './use-cases';
import { IDifyCacheService } from './use-cases/adapters';

@Injectable()
export class DifyAiService implements OnApplicationBootstrap {
  constructor(
    private readonly commandBus: CommandBus,

    @Inject(INJECTION_TOKEN.DIFY_CACHE_SERVICE)
    private readonly difyCacheService: IDifyCacheService,
  ) {}

  async onApplicationBootstrap() {
    // await this.refreshToken();
  }

  static token: string;

  async getToken(user: User): Promise<string> {
    const token = await this.difyCacheService.getDifyAccessToken(user.email);
    if (token) {
      return token;
    }
    const newToken = await this.getDifyAccessToken(user.email);
    await this.difyCacheService.saveDifyAccessToken(user.email, newToken);

    return newToken;
  }

  async createApp(
    email: string,
    input: {
      name: string;
      description: string;
      mode: string;
    },
  ): Promise<CreateAppDifyAiResponseDto> {
    try {
      if (!email) {
        throw new AiBadRequestException('Email is required when creating app');
      }

      const token = await this.getDifyAccessToken(email);
      const command = new CreateAppDifyAiCommand({
        body: {
          ...DEFAULT_CREATE_APP_BODY,
          mode: input.mode,
          name: input.name,
          description: input.description,
        },
        token,
      });

      const result = await this.commandBus.execute<
        CreateAppDifyAiCommand,
        CreateAppDifyAiResponseDto
      >(command);

      return result;
    } catch (error) {
      throw new AiInternalServerError(
        (error.message ?? 'Error creating AI in external provider') as string,
      );
    }
  }

  async updateAppModelConfig(
    email: string,
    input: {
      appId: string;
      model: string;
      instruction: string;
    },
  ): Promise<UpdateAppModelConfigDifyAiResponseDto> {
    if (!email) {
      throw new AiBadRequestException(
        'Email is required when updating app model config',
      );
    }

    const token = await this.getDifyAccessToken(email);
    const command = new UpdateAppModelConfigDifyAiCommand({
      body: {
        ...DEFAULT_AI_MODEL_CONFIG,
        model: {
          ...DEFAULT_AI_MODEL_CONFIG.model,
          name: input.model,
        },
        pre_prompt: input.instruction,
      },
      params: {
        appId: input.appId,
      },
      token,
    });

    const { result } = await this.commandBus.execute<
      UpdateAppModelConfigDifyAiCommand,
      UpdateAppModelConfigDifyAiResponseDto
    >(command);

    return {
      result,
    };
  }

  async updateAppModelConfigV2(
    email: string,
    appId: string,
    input: DifyAiAppModelConfigDto,
  ): Promise<UpdateAppModelConfigDifyAiResponseDto> {
    if (!email) {
      throw new AiBadRequestException(
        'Email is required when updating app model config',
      );
    }

    const token = await this.getDifyAccessToken(email);
    const command = new UpdateAppModelConfigDifyAiCommand({
      body: input,
      params: {
        appId,
      },
      token,
    });

    const { result } = await this.commandBus.execute<
      UpdateAppModelConfigDifyAiCommand,
      UpdateAppModelConfigDifyAiResponseDto
    >(command);

    return {
      result,
    };
  }

  async getAppById(
    email: string,
    input: { appId: string },
  ): Promise<GetAppByIdDifyAiResponseDto> {
    if (!email) {
      throw new AiBadRequestException(
        'Email is required when getting app by id',
      );
    }

    const command = new GetAppByIdDifyAiCommand({
      params: {
        appId: input.appId,
      },
      token: await this.getDifyAccessToken(email),
    });

    const result = await this.commandBus.execute<
      GetAppByIdDifyAiCommand,
      GetAppByIdDifyAiResponseDto
    >(command);

    return { ...result };
  }

  public async getDifyAccessToken(email: string): Promise<string> {
    try {
      const command = new LoginWithoutPasswordDifyAiCommand({
        body: {
          email,
        },
        headers: new InternalApiDifyAiHeaderDto(
          process.env.DIFY_AI_INNER_API_KEY ?? '',
        ),
      });

      const result = await this.commandBus.execute<
        LoginWithoutPasswordDifyAiCommand,
        LoginWithoutPasswordDifyAiResponseDto
      >(command);

      return result.data;
    } catch (error) {
      throw new AiUnauthorizedException(
        (error.message ?? 'Invalid token') as string,
      );
    }
  }

  /**
   * Private methods
   */

  private async getDifyAdminAccessToken(): Promise<string> {
    try {
      const decoded = jwt.decode(DifyAiService.token);

      if (!decoded || typeof decoded === 'string') {
        throw new AiUnauthorizedException('Invalid token');
      }

      const tokenPayload = decoded as DifyAiTokenPayloadDto;
      const expiresAt = tokenPayload.exp - 4 * 60 * 60; // 4 hours before expiration

      if (Date.now() > expiresAt * 1000) {
        await this.refreshToken();
      }

      return DifyAiService.token;
    } catch (error) {
      throw new AiUnauthorizedException(
        (error.message ?? 'Invalid token') as string,
      );
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const command = new LoginDifyAiCommand({
        email: process.env.DIFY_AI_EMAIL ?? '',
        password: process.env.DIFY_AI_PASSWORD ?? '',
      });

      const result = await this.commandBus.execute<
        LoginDifyAiCommand,
        LoginDifyAiResponseDto
      >(command);

      DifyAiService.token = result.data;
    } catch (error) {
      throw new AiUnauthorizedException(
        (error.message ?? 'Failed to refresh token') as string,
      );
    }
  }
}
