import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LokiLogger } from 'gnzs-platform-modules';
import { AvitoTokensEntity } from '../integrations/avito/entities/avito-tokens.entity';
import { AvitoTokensService } from '../integrations/avito/services/avito-token.service';
import { MyCronExpressions } from 'config/constants';

@Injectable()
export class CronService {
  constructor(
    private readonly avitoTokensService: AvitoTokensService,
    @InjectRepository(AvitoTokensEntity)
    private readonly repo: Repository<AvitoTokensEntity>,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(CronService.name);
  }

  @Cron(MyCronExpressions.EVERY_6_HOURS, { name: 'refreshAvitoTokens' })
  async refreshAvitoTokens() {
    this.loki.log('Старт крона: обновление токенов для всех аккаунтов');

    const accounts = await this.repo.find();
    for (const acc of accounts) {
      await this.avitoTokensService.refreshToken(acc.avitoAccountId);
    }
    this.loki.log('Крон: обновление токенов завершено');
  }
}
