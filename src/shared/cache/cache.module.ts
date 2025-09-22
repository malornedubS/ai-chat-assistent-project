import { Global, Module } from '@nestjs/common';
import { GnzsCacheService } from './cache.service';
import { CacheController } from './cache.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Global()
@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 3600,
    }),
  ],
  controllers: [CacheController],
  providers: [GnzsCacheService],
  exports: [GnzsCacheService],
})
export class GnzsCacheModule {}
