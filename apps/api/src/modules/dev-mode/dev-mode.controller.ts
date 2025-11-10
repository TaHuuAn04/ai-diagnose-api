import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsPublic } from '@app/core/decorators';

import { DevModeService } from './dev-mode.service';

@ApiTags('DevMode')
@Controller('dev-mode')
export class DevModeController {
  constructor(private readonly devModeService: DevModeService) {}

  @Get('access-token')
  @IsPublic()
  async getAccessTokenByEmail(@Query('email') email: string) {
    return await this.devModeService.login(email);
  }
}
