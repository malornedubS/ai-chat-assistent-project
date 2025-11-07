import { Module } from '@nestjs/common';
//import { ServeStaticModule } from '@nestjs/serve-static';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from '../config/database.config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { GnzsCacheModule, LokiLoggerModule } from 'gnzs-platform-modules';
import { ClsModule } from 'nestjs-cls';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AmoAccountsModule } from './modules/amo-accounts/amo-accounts.module';
import { ChatGptModule } from './modules/chat-gpt/chat-gpt.module';
import { BotModule } from './modules/bots/bot.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { AvitoModule } from './modules/integrations/avito/avito.module';

import { CronModule } from './modules/cron/cron.module';
import { VkModule } from './modules/integrations/vk/vk.module';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),

    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('dbPlatform'),
      inject: [ConfigService],
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        ...configService.get('redis'),
      }),
      inject: [ConfigService],
    }),
    CronModule,
    GnzsCacheModule,
    WebhookModule,
    AmoAccountsModule,
    AccountsModule,
    LokiLoggerModule,
    ChatGptModule,
    BotModule,
    AvitoModule,
    VkModule,
  ],
})
export class AppModule {}
