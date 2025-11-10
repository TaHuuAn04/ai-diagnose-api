import { Module } from '@nestjs/common';

import { ApiDatabaseModule } from './typeorm-nest/database.module';

@Module({
  imports: [ApiDatabaseModule],
  exports: [ApiDatabaseModule],
})
export class DatabaseModule {}
