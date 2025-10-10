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
    if (cached) return cached;

    // 2. Проверяем БД
    const entity = await this.repo.findOne({
      where: { avitoUserId: accountId },
    });
    if (!entity.accessToken) {
      throw new Error(`Токен для аккаунта ${accountId} не найден.`);
    }

    // 3.Проверяем срок жизни токена (запас 1 час)
    const expireThreshold = new Date(Date.now() + 60 * 60 * 1000);
    if (entity.expiresAt > expireThreshold) {
      await this.cacheService.authToken.set(
        accountId.toString(),
        entity.accessToken,
      );
      return entity.accessToken;
    }

    this.logger.log(
      `Токен устарел для аккаунта ${accountId}, обновляем через refreshToken.`,
    );

    // 4.Ждём, если токен обновляется
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

    // 5.Обновление токена
    this.refreshingTokens[accountId] = true;
    try {
      const { accessToken, refreshToken, expiresIn } =
        await AvitoApi.refreshAccessToken(entity.refreshToken);

      const expiresAt = new Date(Date.now() + expiresIn * 1000);
      await this.repo.update(
        { avitoUserId: accountId },
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresAt,
        },
      );

      await this.cacheService.authToken.set(accountId.toString(), accessToken);

      this.logger.log(`Токен успешно обновлён для аккаунта ${accountId}`);

      return accessToken;
    } catch (error: any) {
      this.logger.error(
        `Ошибка обновления токена для аккаунта ${accountId}: ${error.message}`,
      );
      throw new Error(
        'Не удалось обновить токен. Требуется повторная авторизация пользователя.',
      );
    } finally {
      delete this.refreshingTokens[accountId];
    }
  }

  /**
   * Сохраняет первичные токены
   */
  public async saveTokens(
    accountId: number,
    tokens: { accessToken: string; refreshToken: string; expiresIn: number },
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

    // Сохраняем в БД
    await this.repo.save({
      avitoUserId: accountId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt,
    });

    // Сохраняем в кэш
    await this.cacheService.authToken.set(
      accountId.toString(),
      tokens.accessToken,
    );

    this.logger.log(`Токены Avito успешно сохранены для аккаунта ${accountId}`);
  }
}
