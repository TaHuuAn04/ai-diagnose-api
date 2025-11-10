import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { INJECTION_TOKEN } from '../../common/enums';
import { AuthJwtConfig } from '../../config';
import { User } from '../../infrastructure/database/typeorm-nest/entities';

import { AuthController } from './auth.controller';
import { AuthService } from './infrastructures/auth.service';
import { OtpService } from './infrastructures/otp.service';
import { TempAuthService } from './infrastructures/temp-auth.service';
import { UserService } from './infrastructures/user.service';
import { JwtStrategy } from './strategies';
import {
  RegisterCommandHandler,
  RequestOtpCommandHandler,
  VerifyOtpCommandHandler,
} from './use-cases';

const Adapters = [
  {
    provide: INJECTION_TOKEN.AUTH_SERVICE,
    useClass: AuthService,
  },
  {
    provide: INJECTION_TOKEN.OTP_SERVICE,
    useClass: OtpService,
  },
  {
    provide: INJECTION_TOKEN.USER_SERVICE,
    useClass: UserService,
  },
];

const Handlers = [
  RegisterCommandHandler,
  RequestOtpCommandHandler,
  VerifyOtpCommandHandler,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      global: true,
      inject: [AuthJwtConfig.KEY],
      useFactory: (authConfig: ConfigType<typeof AuthJwtConfig>) => {
        const { jwtSecret, accessTokenExpiration } = authConfig;
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: parseInt(accessTokenExpiration, 10),
          },
        };
      },
    }),
  ],
  providers: [
    ...Adapters,
    ...Handlers,
    JwtStrategy,
    TempAuthService,
    OtpService,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [TempAuthService, AuthService, ...Adapters],
})
export class AuthModule {}
