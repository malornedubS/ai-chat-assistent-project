import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountCreateDto, AccountUpdateDto, AccountsGetManyDto } from './dto/account.dto';
import { LokiLogger } from 'gnzs-platform-modules';
import { GnzsCacheService } from 'src/shared/cache';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly repo: Repository<AccountEntity>,
    private readonly cache: GnzsCacheService,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(AccountsService.name);
  }

  async getOne(id: number): Promise<AccountEntity> {
    try {
      // 1. Проверка кэша
      const cached = await this.cache.account.get(id);
      if (cached) {
        this.loki.log('Достаем из кеша', cached);
        return cached;
      }

      // 2. Извлечение из БД
      const entity = await this.repo.findOne({
        where: { id },
        relations: ['amoAccounts'],
      });
      this.loki.log('Достаем из БД', entity);

      // 3. Кэширование
      if (entity) {
        await this.cache.account.set(id, entity);
        this.loki.log(`Кешируем account:${id}`, entity);
      }

      return entity;
    } catch (e) {
      this.loki.error('Ошибка при получении Account', { e });
      throw e;
    }
  }

  async getMany(query: AccountsGetManyDto): Promise<AccountEntity[]> {
    const { page = 1, limit = 10 } = query;

    return this.repo.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['amoAccounts'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(dto: AccountCreateDto): Promise<AccountEntity> {
    try {
      // 1. Создаём запись в БД
      const account = this.repo.create(dto);
      const result = await this.repo.save(account);

      // 2. Кэшируем новую запись
      await this.cache.account.set(result.id, result);
      this.loki.log(`Кешируем новую запись account:${result.id}`);

      return result;
    } catch (e) {
      this.loki.error('Ошибка при создании Account', e);
      throw e;
    }
  }

  async update(id: number, dto: AccountUpdateDto): Promise<AccountEntity> {
    try {
      // 1. Проверяем существование записи
      const existing = await this.getOne(id);
      if (!existing) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }

      // 2. Обновляем запись в БД
      await this.repo.update(id, dto);

      // 3. Получаем обновлённую версию
      const updated = await this.repo.findOne({
        where: { id },
        relations: ['amoAccounts'],
      });

      if (!updated) {
        throw new Error('Failed to update account');
      }

      // 4. Обновляем кэш
      await this.cache.account.set(id, updated);
      this.loki.log(`Обновляем кеш для account:${id}`);

      return updated;
    } catch (e) {
      this.loki.error('Ошибка при обновлении Account', e);
      throw e;
    }
  }
}
