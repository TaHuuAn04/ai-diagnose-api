import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { REPOSITORY_INJECTION_TOKEN } from 'apps/api/src/common/enums';
import { TypeOrmNestDatabaseConfig } from 'apps/api/src/config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import {
  EndUser,
  User,
} from './entities';
import {
  EndUserRepository,
  UserRepository,
} from './repository';

const Adapters = [
  {
    provide: REPOSITORY_INJECTION_TOKEN.USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.END_USER_REPOSITORY,
    useClass: EndUserRepository,
  },
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [TypeOrmNestDatabaseConfig.KEY],
      useFactory: (config: ConfigType<typeof TypeOrmNestDatabaseConfig>) =>
        config,
      // eslint-disable-next-line @typescript-eslint/require-await
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    TypeOrmModule.forFeature([
      User,
      EndUser
    ]),
  ],
  providers: [...Adapters],
  exports: [...Adapters, TypeOrmModule],
})
export class ApiDatabaseModule {}
