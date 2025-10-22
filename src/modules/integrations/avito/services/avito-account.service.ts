import { Injectable, NotFoundException } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GnzsCacheService } from 'src/shared/cache';
import { AvitoAccountsEntity } from '../entities/avito-accounts.entity';
import { avitoAccountDto } from '../dto/avito-account.dto';

@Injectable()
export class AvitoAccountsService {
  constructor(
    @InjectRepository(AvitoAccountsEntity)
    private readonly repo: Repository<AvitoAccountsEntity>,
    private readonly cache: GnzsCacheService,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(AvitoAccountsService.name);
  }

  async getOne(id: number): Promise<AvitoAccountsEntity> {
    try {
      // 1. Проверка кэша
      const cached = await this.cache.avitoAccount.get(id);
      if (cached) {
        this.loki.log('Достаем AvitoAccount из кеша', cached);
        return cached;
      }

      // 2. Извлечение из БД
      const entity = await this.repo.findOne({ where: { id }, relations: ['account'] });
      this.loki.log('Достаем AvitoAccount из БД', entity);

      // 3. Кэширование
      if (entity) {
        await this.cache.avitoAccount.set(id, entity);
        this.loki.log(`Кешируем AvitoAccount: ${entity.name}`, entity);
      }

      return entity;
    } catch (e) {
      this.loki.error('Ошибка при получении AvitoAccount', { e });
    }
  }

  async getByAvitoAccountId(avitoAccountId: number): Promise<AvitoAccountsEntity> {
    try {
      const entity = await this.repo.findOne({ where: { avitoAccountId }, relations: ['account'] });

      if (entity) {
        await this.cache.avitoAccount.set(entity.id, entity);
      }

      return entity;
    } catch (e) {
      this.loki.error('Ошибка при получении AvitoAccount по avito_user_id', {
        e,
      });
    }
  }

  async create(avitoAccountData: avitoAccountDto, accountId: number): Promise<AvitoAccountsEntity> {
    try {
      // 1. Создаём запись в БД
      const avitoAccount = this.repo.create({
        accountId: accountId,
        avitoAccountId: avitoAccountData.id,
        name: avitoAccountData.name,
        email: avitoAccountData.email,
      });

      const result = await this.repo.save(avitoAccount);

      // 2. Кэшируем новую запись
      await this.cache.avitoAccount.set(result.id, result);
      this.loki.log(`Кешируем новый AvitoAccount: ${result.name}`, result);

      return result;
    } catch (e) {
      this.loki.error('Ошибка при создании AvitoAccount', e);
    }
  }

  async update(id: number, updateData: Partial<AvitoAccountsEntity>): Promise<AvitoAccountsEntity> {
    try {
      // 1. Проверяем существование записи
      const existing = await this.getOne(id);
      if (!existing) {
        throw new NotFoundException(`AvitoAccount with ID ${id} not found`);
      }

      // 2. Обновляем запись в БД
      await this.repo.update(id, updateData);

      // 3. Получаем обновлённую версию
      const updated = await this.repo.findOne({ where: { id }, relations: ['account'] });

      if (!updated) {
        throw new Error('Failed to update AvitoAccount');
      }

      // 4. Обновляем кэш
      await this.cache.avitoAccount.set(id, updated);

      return updated;
    } catch (e) {
      this.loki.error('Ошибка при обновлении AvitoAccount', e);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
      await this.cache.avitoAccount.del(id);
      this.loki.log(`Удален AvitoAccount с ID: ${id}`);
    } catch (e) {
      this.loki.error('Ошибка при удалении AvitoAccount', e);
    }
  }
}
