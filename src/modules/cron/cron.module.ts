import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { AvitoTokensEntity } from '../integrations/avito/entities/avito-tokens.entity';
import { AvitoTokensService } from '../integrations/avito/services/avito-token.service';
import { LokiLogger } from 'gnzs-platform-modules';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([AvitoTokensEntity]),
  ],
  providers: [CronService, AvitoTokensService, LokiLogger],
})
export class CronModule {}
