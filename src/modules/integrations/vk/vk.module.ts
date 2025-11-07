import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VkAuthController } from './controllers/vk-auth.controller';
import { VkAuthService } from './services/vk-auth.service';
import { VkTokensService } from './services/vk-tokens.service';

import { VkTokenEntity } from './entities/vk-tokens.entity';
import { VkAccountsEntity } from './entities/vk-accounts.entity';
import { VkAccountsService } from './services/vk-accounts.servie';
import { VkService } from './services/vk.service';
import { VkMessagesController } from './controllers/vk-messages.controller';
import { VkGroupsTokenEntity } from './entities/vk-groups-tokens';

import VkApi from 'src/shared/api/vk-api/vk-api.class';
import { LokiLogger } from 'gnzs-platform-modules';
import { VkAccountsController } from './controllers/vk-accounts';

@Module({
  imports: [TypeOrmModule.forFeature([VkTokenEntity, VkAccountsEntity, VkGroupsTokenEntity])],
  controllers: [VkAuthController, VkMessagesController, VkAccountsController],
  providers: [VkAuthService, VkTokensService, VkAccountsService, LokiLogger, VkService, VkApi],
  exports: [VkTokensService, VkAccountsService],
})
export class VkModule {}
