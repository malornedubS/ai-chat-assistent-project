import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AvitoTokensService } from './services/avito-token.service';
import { GnzsCacheModule } from 'src/shared/cache';
import { AvitoController } from './controllers/avito.controller';
import { BotModule } from 'src/modules/bots/bot.module';
import { MessageModule } from 'src/modules/messages/message.module';
import { AvitoService } from './services/avito.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvitoTokensEntity } from './entities/avito-tokens.entity';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { AvitoAccountsEntity } from './entities/avito-accounts.entity';
import { AvitoAuthController } from './controllers/avito-auth.controller';
import { AvitoAuthService } from './services/avito-auth.service';
import { AvitoAccountsService } from './services/avito-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvitoTokensEntity, AvitoAccountsEntity]), HttpModule, GnzsCacheModule, BotModule, MessageModule, AvitoApi],
  controllers: [AvitoController, AvitoAuthController],
  providers: [AvitoTokensService, AvitoService, AvitoApi, AvitoAuthService, AvitoAccountsService],
  exports: [AvitoTokensService],
})
export class AvitoModule {}
