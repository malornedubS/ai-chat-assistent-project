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
import { AvitoAccountEntity } from './entities/avito-accounts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvitoTokensEntity, AvitoAccountEntity]),
    HttpModule,
    GnzsCacheModule,
    BotModule,
    MessageModule,
    AvitoApi,
  ],
  controllers: [AvitoController],
  providers: [AvitoTokensService, AvitoService, AvitoApi],
  exports: [AvitoTokensService],
})
export class AvitoModule {}
