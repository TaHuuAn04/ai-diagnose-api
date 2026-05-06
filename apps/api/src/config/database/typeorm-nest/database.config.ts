import { join } from 'path';

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from '@app/core/environments';

import { CONFIG_KEY } from '../../config-key';

import { NamingStrategy } from './naming.strategy';

export default registerAs<TypeOrmModuleOptions>(CONFIG_KEY.DATABASE, () => ({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      'infrastructure',
      'database',
      'typeorm-nest',
      'entities',
      '*.entity{.ts,.js}',
    ),
  ],
  namingStrategy: new NamingStrategy(),
  synchronize: false,
  extra: {
    max: 30,
    min: 5,
    idleTimeoutMillis: 30000,
  },
  migrationsTableName: '__migrations',
  migrations: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      'infrastructure',
      'database',
      'typeorm-nest',
      'migrations',
      '*.ts',
    ),
  ],
}));
