import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { AuthJwtConfig } from 'apps/api/src/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthPayload } from '../interfaces/auth-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AuthJwtConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthJwtConfig>,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  validate(payload?: AuthPayload) {
    if (!payload) {
      throw new UnauthorizedException('Unauthorized');
    }
    return payload;
  }
}
