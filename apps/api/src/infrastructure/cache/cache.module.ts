import { Global, Module } from '@nestjs/common';

import { INJECTION_TOKEN } from '@api/enums';

import { CacheService } from './cache.service';
import { RedisCacheModule } from './redis-cache.module';

const Adapters = [
  {
    provide: INJECTION_TOKEN.CACHE_SERVICE,
    useClass: CacheService,
  },
];

@Global()
@Module({
  imports: [RedisCacheModule],
  exports: [...Adapters],
  providers: [...Adapters, RedisCacheModule],
})
export class CacheModule {}
