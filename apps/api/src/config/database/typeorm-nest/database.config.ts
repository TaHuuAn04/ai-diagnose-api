import { join } from 'path';

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { CONFIG_KEY } from '../../config-key';

import { NamingStrategy } from './naming.strategy';

export default registerAs<TypeOrmModuleOptions>(CONFIG_KEY.DATABASE, () => ({
  type: 'postgres',
  host: process.env.API_DB_HOST ?? 'localhost',
  port: parseInt(process.env.API_DB_PORT ?? '5432', 10),
  username: process.env.API_DB_USERNAME ?? 'postgres',
  password: process.env.API_DB_PASSWORD ?? 'postgres',
  database: process.env.API_DB_NAME ?? 'postgres',
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
