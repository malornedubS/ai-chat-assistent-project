import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { AvitoTokensEntity } from '../integrations/avito/entities/avito-tokens.entity';
import { AvitoTokensService } from '../integrations/avito/services/avito-token.service';
import { LokiLogger } from 'gnzs-platform-modules';
import { VkTokensService } from '../integrations/vk/services/vk-tokens.service';
import { VkUsersTokenEntity } from '../integrations/vk/entities/vk-users-tokens.entity';
import { VkGroupsTokenEntity } from '../integrations/vk/entities/vk-groups-tokens.entity';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([AvitoTokensEntity, VkUsersTokenEntity, VkGroupsTokenEntity])],
  providers: [CronService, AvitoTokensService, VkTokensService, LokiLogger],
})
export class CronModule {}
