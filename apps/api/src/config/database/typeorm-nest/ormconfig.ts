import { join } from 'path';

import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

import { NamingStrategy } from './naming.strategy';

dotenv.config();

const options: DataSourceOptions = {
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
