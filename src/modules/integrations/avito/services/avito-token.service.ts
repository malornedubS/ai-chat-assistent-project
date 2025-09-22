import { Injectable } from '@nestjs/common';
import { LokiLogger, wait } from 'gnzs-platform-modules';
import AvitoMessageApi from 'src/shared/api/avito-api/avito-message-api.class';
import { GnzsCacheService } from 'src/shared/cache';
import { Repository } from 'typeorm';
import { TokensEntity } from '../entities/avito-tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AvitoTokensService {
  private refreshingTokens: { [accountId: string]: boolean } = {};

  constructor(
    @InjectRepository(TokensEntity)
    private readonly repo: Repository<TokensEntity>,
    private readonly logger: LokiLogger,
    private readonly cacheService: GnzsCacheService,
  ) {}

  public async getToken(accountId: number): Promise<string> {
    // 1. Проверяем кэш
    const cached = await this.cacheService.authToken.get(accountId.toString());
    if (cached) {
      this.logger.log(`Нашли токен в кэше для accountId=${accountId}`);
      return cached;
    }

    // 2. Проверяем БД
    const entity = await this.repo.findOne({
      where: { id: accountId },
      relations: ['account'],
    });

    // TODO:Нужно ли сделать условие для обновления токена если до конца его жизни осталось меньше часа
    if (entity?.accessToken && entity?.expiresAt > new Date()) {
      this.logger.log(`Нашли актуальный токен в БД для accountId=${accountId}`);
      await this.cacheService.authToken.set(
        accountId.toString(),
        entity.accessToken,
      );
      return entity.accessToken;
    }

    this.logger.log(`Токен в кэше и БД не найден для accountId=${accountId}`);

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

      const authApi = new AvitoMessageApi('', this.logger);
      const response = await authApi.getAccessToken();
      const token = response.access_token;
      const expiresAt = new Date(Date.now() + response.expires_in * 1000);
      // Сохраняем в кэш
      await this.cacheService.authToken.set(accountId.toString(), token);

      // Сохраняем в БД
      if (entity) {
        entity.accessToken = token;
        entity.expiresAt = expiresAt;
        await this.repo.save(entity);
      } else {
        await this.repo.save({
          account: { id: accountId },
          source: 'avito',
          accessToken: token,
          expiresAt,
        });
      }

      this.logger.log(
        `Новый токен получен и сохранён для accountId=${accountId}`,
      );
      return token;
    } catch (error) {
      this.logger.error(
        `Ошибка получения токена для accountId=${accountId}: ${error.message}`,
      );
      throw error;
    } finally {
      delete this.refreshingTokens[accountId];
    }
  }
}
