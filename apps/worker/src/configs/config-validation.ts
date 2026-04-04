/* config-validation.ts */

import { plainToClass } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
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
  @IsEnum(Environment)
  API_NODE_ENV: Environment;

  @IsDefined()
  @IsNumber()
  WORKER_PORT: number;

  @IsOptional()
  @IsString()
  NOVU_SERVER_URL: string;

  @IsOptional()
  @IsString()
  NOVU_API_KEY: string;

  @IsDefined()
  @IsNumberString()
  @MinLength(1)
  REDIS_DB: string;

  @IsDefined()
  @IsString()
  @MinLength(1)
  AI_SERVICE_BASE_URL: string;
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

