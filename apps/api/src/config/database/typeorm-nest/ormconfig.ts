import { join } from 'path';

import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from '@app/core/environments';

import { NamingStrategy } from './naming.strategy';

dotenv.config();

const options: DataSourceOptions = {
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
  synchronize: false,
  migrationsRun: true,
};

export const connectionSource = new DataSource(options);
