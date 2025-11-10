import { CacheModule } from './cache/cache.module'
import { DatabaseModule } from './database/database.module'
import { WorkerModule } from './worker/worker.module'

export const infrastructures = [
  DatabaseModule,
  CacheModule,
  WorkerModule,
];
