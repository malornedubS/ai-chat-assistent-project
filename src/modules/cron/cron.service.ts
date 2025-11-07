import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LokiLogger } from 'gnzs-platform-modules';
import { AvitoTokensEntity } from '../integrations/avito/entities/avito-tokens.entity';
import { AvitoTokensService } from '../integrations/avito/services/avito-token.service';
import { VkTokensService } from '../integrations/vk/services/vk-tokens.service';
import { MyCronExpressions } from 'config/constants';
import { VkTokenEntity } from '../integrations/vk/entities/vk-tokens.entity';

@Injectable()
export class CronService {
  constructor(
    private readonly avitoTokensService: AvitoTokensService,
    private readonly vkTokensService: VkTokensService,
    @InjectRepository(AvitoTokensEntity)
    private readonly avitoRepo: Repository<AvitoTokensEntity>,
    @InjectRepository(VkTokenEntity)
    private readonly vkRepo: Repository<VkTokenEntity>,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(CronService.name);
  }

  @Cron(MyCronExpressions.EVERY_6_HOURS, { name: 'refreshAvitoTokens' })
  async refreshAvitoTokens() {
    this.loki.log('Старт крона: обновление токенов для всех АВИТО аккаунтов');

    const accounts = await this.avitoRepo.find();
    for (const acc of accounts) {
      await this.avitoTokensService.refreshToken(acc.avitoAccountId);
    }
    this.loki.log('Крон: обновление токенов завершено');
  }

  @Cron(MyCronExpressions.EVERY_50_MINUTES, { name: 'refreshVkTokens' })
  async refreshVkTokens() {
    this.loki.log('Старт крона: обновление токенов для всех ВК аккаунтов');

    const accounts = await this.vkRepo.find();
    for (const acc of accounts) {
      try {
        await this.vkTokensService.refreshToken(acc.vkUserId);
        this.loki.log(`Успешно обновлен токен для VK пользователя: ${acc.vkUserId}`);
      } catch (error) {
        this.loki.error(`Ошибка обновления токена для VK пользователя ${acc.vkUserId}:`, error);
      }
    }
    this.loki.log('Крон: обновление VK токенов завершено');
  }
}
