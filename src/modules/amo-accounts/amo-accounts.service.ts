import { Injectable, NotFoundException } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
import { AmoCreateDto, AmoGetManyDto, AmoUpdateDto } from './dto/amo-account.dto';
import { AmoAccountEntity } from './entities/amo-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GnzsCacheService } from 'src/shared/cache';

@Injectable()
export class AmoAccountsService {
  constructor(
    @InjectRepository(AmoAccountEntity)
    private readonly repo: Repository<AmoAccountEntity>,
    private readonly cache: GnzsCacheService,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(AmoAccountsService.name);
  }

  async getOne(id: number): Promise<AmoAccountEntity> {
    try {
      // 1. Проверка кэша
      const cached = await this.cache.amoAccount.get(id);
      if (cached) {
        this.loki.log('Достаем из кеша', cached);
        return cached;
      }

      // 2. Извлечение из БД
      const entity = await this.repo.findOne({
        where: { id },
        relations: ['account'],
      });
      this.loki.log('Достаем из БД', entity);

      // 3. Кэширование
      if (entity) {
        await this.cache.amoAccount.set(id, entity);
        this.loki.log(`Кешируем account:${entity.name}`, entity);
      }

      return entity;
    } catch (e) {
      this.loki.error('Ошибка при получении AmoAccount', { e });
    }
  }
  async getMany(query: AmoGetManyDto): Promise<AmoAccountEntity[]> {
    const { page = 1, limit = 2 } = query;

    return this.repo.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['account'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createAmoDto: AmoCreateDto): Promise<AmoAccountEntity> {
    try {
      // 1. Создаём запись в БД
      const amo = this.repo.create(createAmoDto);
      const result = await this.repo.save(amo);

      // 2. Кэшируем новую запись
      await this.cache.amoAccount.set(result.id, result);
      this.loki.log(`Кешируем новую запись: ${result.name}`, result);

      return result;
    } catch (e) {
      this.loki.error('Ошибка при создании AmoAccount', e);
    }
  }

  async update(id: number, updateAmoDto: AmoUpdateDto): Promise<AmoAccountEntity> {
    try {
      // 1. Проверяем существование записи
      const existing = await this.getOne(id);
      if (!existing) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }

      // 2. Обновляем запись в БД
      await this.repo.update(id, updateAmoDto);

      // 3. Получаем обновлённую версию
      const updated = await this.repo.findOne({
        where: { id },
        relations: ['account'],
      });
      if (!updated) {
        throw new Error('Failed to update account');
      }
      // 4. Обновляем кэш
      await this.cache.amoAccount.set(id, updated);

      return updated;
    } catch (e) {
      this.loki.error('Ошибка при обновлении AmoAccount', e);
    }
  }
}
