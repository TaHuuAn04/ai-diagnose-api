/* config-validation.ts */

import { plainToClass } from 'class-transformer';
import {
  IsAlpha,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  LOCAL = 'local',
}

class EnvironmentVariables {
  /* API APP CONFIG */
  @IsDefined()
  @IsString()
  @MinLength(1)
  HOST: string;

  @IsDefined()
  @IsEnum(Environment)
  API_NODE_ENV: Environment;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  API_PORT: string;

  /* API DATABASE CONFIG */
  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  API_DB_PORT: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  API_DB_HOST: string;

  @IsDefined()
  @IsAlpha()
  @MinLength(1)
  API_DB_USERNAME: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  API_DB_PASSWORD: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  API_DB_NAME: string;

  // Auth Config
  @IsDefined()
  @IsString()
  @MinLength(1)
  ACCESS_TOKEN_SECRET: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  JWT_RESET_PASSWORD_KEY: string;

  /* Dify AI Config */
  @IsDefined()
  @IsString()
  @MinLength(1)
  DIFY_AI_API_URL: string;

  @IsDefined()
  @IsEmail()
  @MinLength(1)
  DIFY_AI_EMAIL: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DIFY_AI_PASSWORD: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DIFY_AI_INNER_API_KEY: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DIFY_AI_OPENAI_API_KEY: string;

  /* Redis Config */
  @IsDefined()
  @IsString()
  @MinLength(1)
  REDIS_HOST: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  REDIS_PORT: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  REDIS_DB: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  REDIS_TTL: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  LOGIN_OTP_EXPIRE_TIME: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  REGISTER_OTP_EXPIRE_TIME;

  @IsDefined()
  @IsString()
  @MinLength(1)
  OTP_RESEND_TIME;

  @IsDefined()
  @IsString()
  @MinLength(1)
  INTERNAL_WORKER_API_URL: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  DASHBOARD_URL: string;
}

export function validateConfig(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  let index = 0;
  for (const err of errors) {
    Object.values(err.constraints ?? {}).forEach((str) => {
      ++index;
      console.log(index, str);
    });
    console.log('\n ***** \n');
  }
  if (errors.length)
    throw new Error('Please provide the valid ENVs mentioned above');

  return finalConfig;
}
