import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AvitoTokensService } from './services/avito-token.service';
import { GnzsCacheModule } from 'src/shared/cache';
import { AvitoController } from './controllers/avito.controller';
import { BotModule } from 'src/modules/bots/bot.module';
import { MessageModule } from 'src/modules/messages/message.module';
import { AvitoService } from './services/avito.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensEntity } from './entities/avito-tokens.entity';
import AvitoMessageApi from 'src/shared/api/avito-api/avito-message-api.class';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokensEntity]),
    HttpModule,
    GnzsCacheModule,
    BotModule,
    MessageModule,
    AvitoMessageApi,
  ],
  controllers: [AvitoController],
  providers: [AvitoTokensService, AvitoService, AvitoMessageApi],
  exports: [AvitoTokensService],
})
export class AvitoModule {}
