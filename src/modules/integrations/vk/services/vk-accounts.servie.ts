import { Injectable, NotFoundException } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GnzsCacheService } from 'src/shared/cache';
import { VkAccountsEntity } from '../entities/vk-accounts.entity';
import { VkUserDto, VkUserGroupsResponseDto } from '../dto/vk-accounts.dto';
import VkApi from 'src/shared/api/vk-api/vk-api.class';

@Injectable()
export class VkAccountsService {
  constructor(
    @InjectRepository(VkAccountsEntity)
    private readonly repo: Repository<VkAccountsEntity>,
    private readonly api: VkApi,
    private readonly cache: GnzsCacheService,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(VkAccountsService.name);
  }

  /**
   * Получить VK аккаунт по ID (наш внутренний ID)
   */
  async getOne(id: number): Promise<VkAccountsEntity> {
    try {
      // 1. Проверка кэша
      const cached = await this.cache.vkAccount.get(id);
      if (cached) {
        this.loki.log('Достаем VkAccount из кеша', cached);
        return cached;
      }

      // 2. Извлечение из БД
      const entity = await this.repo.findOne({
        where: { vkUserId: id },
        relations: ['account'],
      });
      this.loki.log('Достаем VkAccount из БД', entity);

      // 3. Кэширование
      if (entity) {
        await this.cache.vkAccount.set(id, entity);
        this.loki.log(`Кешируем VkAccount: ${entity.fullName}`, entity);
      }

      return entity;
    } catch (e) {
      this.loki.error('Ошибка при получении VkAccount', { e });
      throw e;
    }
  }

  /**
   * Получить VK аккаунт по vk_user_id (ID пользователя VK)
   */
  async getByVkUserId(vkUserId: number): Promise<VkAccountsEntity> {
    try {
      const entity = await this.repo.findOne({
        where: { vkUserId },
        relations: ['token'],
      });

      if (entity) {
        await this.cache.vkAccount.set(entity.vkUserId, entity);
      }

      return entity;
    } catch (e) {
      this.loki.error('Ошибка при получении VkAccount по vk_user_id', { e });
      throw e;
    }
  }

  /**
   * Получить все VK аккаунты нашего пользователя
   */
  async getByAccountId(accountId: number): Promise<VkAccountsEntity[]> {
    try {
      const entities = await this.repo.find({
        where: { accountId },
        relations: ['account', 'token'],
      });

      for (const entity of entities) {
        await this.cache.vkAccount.set(entity.vkUserId, entity);
      }

      return entities;
    } catch (e) {
      this.loki.error('Ошибка при получении VkAccounts по account_id', { e });
      throw e;
    }
  }

  /**
   * Создать новый VK аккаунт
   */
  async create(vkUserData: VkUserDto, accountId: number): Promise<VkAccountsEntity> {
    try {
      // 1. Создаём запись в БД
      const vkAccount = this.repo.create({
        accountId: accountId,
        vkUserId: vkUserData.vkUserId,
        fullName: vkUserData.fullName,
      });

      const result = await this.repo.save(vkAccount);

      // 2. Кэшируем новую запись
      await this.cache.vkAccount.set(result.vkUserId, result);
      this.loki.log(`Кешируем новый VkAccount: ${result.fullName}`, result);

      return result;
    } catch (e) {
      this.loki.error('Ошибка при создании VkAccount', e);
      throw e;
    }
  }

  /**
   * Обновить VK аккаунт
   */
  async update(vkUserId: number, updateData: Partial<VkAccountsEntity>): Promise<VkAccountsEntity> {
    try {
      // 1. Проверяем существование записи
      const existing = await this.getByVkUserId(vkUserId);
      if (!existing) {
        throw new NotFoundException(`VkAccount with ID ${vkUserId} not found`);
      }

      // 2. Обновляем запись в БД
      await this.repo.update(vkUserId, updateData);

      // 3. Получаем обновлённую версию
      const updated = await this.repo.findOne({
        where: { vkUserId },
        relations: ['account', 'token'],
      });

      if (!updated) {
        throw new Error('Failed to update VkAccount');
      }

      // 4. Обновляем кэш
      await this.cache.vkAccount.set(vkUserId, updated);

      return updated;
    } catch (e) {
      this.loki.error('Ошибка при обновлении VkAccount', e);
      throw e;
    }
  }

  /**
   * Удалить VK аккаунт
   */
  async delete(vkUserId: number): Promise<void> {
    try {
      await this.repo.delete(vkUserId);
      await this.cache.vkAccount.del(vkUserId);
      this.loki.log(`Удален VkAccount с ID: ${vkUserId}`);
    } catch (e) {
      this.loki.error('Ошибка при удалении VkAccount', e);
      throw e;
    }
  }

  public async getUserGroups(vkUserId: number): Promise<VkUserGroupsResponseDto[]> {
    try {
      const vkAccount = await this.getByVkUserId(vkUserId);
      if (!vkAccount || !vkAccount.token) {
        throw new NotFoundException(`Учетная запись ВК или токен не найдены для пользователя${vkUserId}`);
      }
      const vkApi = new VkApi(vkAccount.token.accessToken, this.loki);

      const response = await vkApi.getUserGroups();
      return response?.response?.items || [];
    } catch (e) {
      this.loki.error('Ошибка при получении групп пользователя VK', { vkUserId, error: e.message });
      throw e;
    }
  }
}
