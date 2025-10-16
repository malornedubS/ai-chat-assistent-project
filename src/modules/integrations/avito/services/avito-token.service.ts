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
    try {
      // 1. Проверяем кэш
      const cached = await this.cacheService.authToken.get(
        accountId.toString(),
      );
      if (cached) return cached;

      // 2. Проверяем БД
      const token = await this.repo.findOne({
        where: { avitoAccountId: accountId },
      });

      if (!token || !token.accessToken) {
        throw new Error(`Токен для аккаунта ${accountId} не найден.`);
      }

      // 3. Проверяем срок жизни токена (запас 1 час)
      const expireThreshold = new Date(Date.now() + 60 * 60 * 1000);
      if (token.expiresAt > expireThreshold) {
        await this.cacheService.authToken.set(
          accountId.toString(),
          token.accessToken,
        );
        return token.accessToken;
      }

      // 4. Вызываем отдельный метод для обновления токена
      return await this.refreshToken(accountId);
    } catch (error) {
      this.logger.error('Ошибка получения токена Avito:', {
        accountId,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }

  /**
   * Обновление токена
   */
  public async refreshToken(accountId: number): Promise<string> {
    // 1. Получаем токен из БД
    const token = await this.repo.findOne({
      where: { avitoAccountId: accountId },
    });

    if (!token) {
      throw new Error(`Токен для аккаунта ${accountId} не найден`);
    }

    this.logger.log(
      `Токен устарел для аккаунта ${accountId}, обновляем через refreshToken.`,
    );

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

    // 2. Обновление токена
    this.refreshingTokens[accountId] = true;
    try {
      const { accessToken, refreshToken, expiresIn } =
        await AvitoApi.refreshAccessToken(token.refreshToken);

      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      await this.repo.save({
        avitoAccountId: accountId,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt,
      });

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
  public async saveToken(
    avitoAccountId: number,
    tokens: { accessToken: string; refreshToken: string; expiresIn: number },
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

    await this.repo.save({
      avitoAccountId: avitoAccountId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt,
    });

    await this.cacheService.authToken.set(
      avitoAccountId.toString(),
      tokens.accessToken,
    );

    this.logger.log(
      `Токены Avito успешно сохранены для аккаунта ${avitoAccountId}`,
    );
  }
}
