import { Injectable } from '@nestjs/common';
import { LokiLogger, wait } from 'gnzs-platform-modules';
import VkApi from 'src/shared/api/vk-api/vk-api.class';
import { GnzsCacheService } from 'src/shared/cache';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VkTokenEntity } from '../entities/vk-tokens.entity';
import { VkGroupsTokenEntity } from '../entities/vk-groups-tokens';

@Injectable()
export class VkTokensService {
  private refreshingTokens: { [vkUserId: string]: boolean } = {};

  constructor(
    @InjectRepository(VkTokenEntity)
    private readonly repo: Repository<VkTokenEntity>,
    @InjectRepository(VkGroupsTokenEntity)
    private readonly repoGroup: Repository<VkGroupsTokenEntity>,
    private readonly logger: LokiLogger,
    private readonly cacheService: GnzsCacheService,
  ) {}

  public async getToken(vkUserId: number): Promise<string> {
    try {
      const cached = await this.cacheService.vkAuthToken.get(vkUserId);
      if (cached) return cached;

      const token = await this.repo.findOne({ where: { vkUserId } });

      if (!token || !token.accessToken) {
        throw new Error(`Токен для пользователя VK ${vkUserId} не найден.`);
      }

      if (!this.isTokenExpired(token)) {
        await this.cacheService.vkAuthToken.set(vkUserId, token.accessToken);
        return token.accessToken;
      }

      return await this.refreshToken(vkUserId);
    } catch (error) {
      this.logger.error('Ошибка получения токена VK:', { vkUserId, error: error.message, stack: error.stack });

      throw error;
    }
  }

  /**
   * Обновление токена
   */
  public async refreshToken(vkUserId: number): Promise<string> {
    const token = await this.repo.findOne({ where: { vkUserId } });
    if (!token) {
      throw new Error(`Токен для пользователя VK ${vkUserId} не найден`);
    }
    this.logger.log(`Токен устарел для пользователя VK ${vkUserId}, обновляем через refreshToken.`);

    const maxAttempts = 100;
    let attempts = 0;

    while (this.refreshingTokens[vkUserId] && attempts < maxAttempts) {
      await wait(500);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error(`Тайм-аут обновления токена для пользователя VK ${vkUserId} после ${maxAttempts} попыток`);
    }

    this.refreshingTokens[vkUserId] = true;
    try {
      const { access_token, refresh_token, expires_in } = await VkApi.refreshAccessToken(token.refreshToken, token.deviceId, token.state);

      const expiresAt = new Date(Date.now() + expires_in * 1000);
      console.log('Обновленные токены VK:', { access_token, refresh_token, expires_in });
      await this.repo.save({ vkUserId, accessToken: access_token, refreshToken: refresh_token, expiresAt });
      await this.cacheService.vkAuthToken.set(vkUserId, access_token);

      this.logger.log(`Токен успешно обновлён для пользователя VK ${vkUserId}`);

      return access_token;
    } catch (error: any) {
      this.logger.error(`Ошибка обновления токена для пользователя VK ${vkUserId}: ${error.message}`);
      throw new Error('Не удалось обновить токен. Требуется повторная авторизация пользователя.');
    } finally {
      delete this.refreshingTokens[vkUserId];
    }
  }

  /**
   * Сохраняет первичные токены пользователя
   */
  public async saveUserTokens(
    vkUserId: number,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    deviceId: string,
    expiresIn: number,
  ): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await this.repo.save({ vkUserId, accessToken, refreshToken, idToken, deviceId, expiresAt });
    await this.cacheService.vkAuthToken.set(vkUserId, accessToken);
    this.logger.log(`Токены VK успешно сохранены для пользователя ${vkUserId}`);
  }

  /**
   * Сохраняет первичные токены группы
   */
  async saveGroupToken(vkUserId: number, vkGroupId: number, accessToken: string) {
    await this.repoGroup.save({
      vkUserId,
      vkGroupId,
      accessToken,
    });
  }

  /**
   * Сохрание state в бд для последующего обновления токена
   */
  public async updateState(vkUserId: number, state: string): Promise<void> {
    await this.repo.update({ vkUserId }, { state });
    this.logger.log(`State для пользователя VK ${vkUserId} обновлён`);
  }

  private isTokenExpired(token: { expiresAt: Date }): boolean {
    const threshold = new Date(Date.now() + 60 * 60 * 1000);
    return token.expiresAt <= threshold;
  }
}
