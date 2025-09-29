import { Injectable } from '@nestjs/common';
import { LokiLogger, wait } from 'gnzs-platform-modules';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { GnzsCacheService } from 'src/shared/cache';
import { Repository } from 'typeorm';
import { AvitoTokensEntity } from '../entities/avito-tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AvitoTokensService {
  private refreshingTokens: { [accountId: string]: boolean } = {};

  constructor(
    @InjectRepository(AvitoTokensEntity)
    private readonly repo: Repository<AvitoTokensEntity>,
    private readonly logger: LokiLogger,
    private readonly cacheService: GnzsCacheService,
  ) {}

  public async getToken(accountId: number): Promise<string> {
    // 1. Проверяем кэш
    const cached = await this.cacheService.authToken.get(accountId.toString());
    if (cached) {
      this.logger.log(`Нашли токен в кэше для аккаунта: ${accountId}`);
      return cached;
    }

    // 2. Проверяем БД
    const entity = await this.repo.findOne({
      where: { avitoAccountId: accountId },
    });

    if (entity?.accessToken && entity?.expiresAt > new Date()) {
      this.logger.log(`Нашли актуальный токен в БД для аккаунта: ${accountId}`);
      await this.cacheService.authToken.set(
        accountId.toString(),
        entity.accessToken,
      );
      return entity.accessToken;
    }

    this.logger.log(`Токен в кэше и БД не найден для аккаунта: ${accountId}`);

    // 3. Ждём, если токен обновляется
    const maxAttempts = 100;
    let attempts = 0;

    while (this.refreshingTokens[accountId] && attempts < maxAttempts) {
      await wait(500);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error(
        `Тайм-аут обновления токена для учетной записи ${accountId} после ${maxAttempts} попыток`,
      );
    }

    // 4. Запрашиваем новый токен
    try {
      this.refreshingTokens[accountId] = true;

      const { accessToken, expiresIn } = await AvitoApi.getAccessToken();
      const expiresAt = new Date(Date.now() + expiresIn * 1000);
      // Сохраняем в кэш
      await this.cacheService.authToken.set(accountId.toString(), accessToken);

      // Сохраняем в БД
      if (entity) {
        await this.repo.update(entity.avitoAccountId, {
          accessToken,
          expiresAt,
        });
      } else {
        await this.repo.insert({
          avitoAccountId: accountId,
          accessToken,
          expiresAt,
        });
      }

      this.logger.log(
        `Новый токен получен и сохранён для аккаунта: ${accountId}`,
      );
      return accessToken;
    } catch (error) {
      this.logger.error(
        `Ошибка получения токена для аккаунта: ${accountId}: ${error.message}`,
      );
      throw error;
    } finally {
      delete this.refreshingTokens[accountId];
    }
  }
}
