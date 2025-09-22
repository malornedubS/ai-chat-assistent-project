import { ApiProperty } from '@nestjs/swagger';

import { info } from 'console';
import { Info } from './info.account.dto';

export class AmoCreateDto {
  @ApiProperty({
    example: 'Max',
    description: 'Имя аккаунта',
  })
  name: string;

  @ApiProperty({ example: 'maxx.amocrm.ru', description: 'Субдомен аккаунта' })
  subdomain: string;

  @ApiProperty({ example: 'false', description: 'Технический аккаунт?' })
  isTech: boolean;

  @ApiProperty({
    example: '2025-12-31T23:59:59.000Z',
    description: 'Дата, до которой оплачен тариф ',
  })
  paidTill: Date;

  @ApiProperty({
    example: 'premium',
    description: 'Название тарифа, активного на аккаунте',
  })
  tariff: string;

  @ApiProperty({
    example: '30',
    description: 'число сотрудников',
  })
  usersCount: number;

  @ApiProperty({
    type: () => info,
    description: 'Дополнительная информация об аккаунте ',
  })
  info: Info;

  @ApiProperty({
    example: { someKey: 'someValue' },
    description: 'Сырые данные аккаунта AmoCRM, полученные с API',
  })
  objectAmo: object;

  @ApiProperty({
    example: {
      user1: { id: 1, name: 'User One' },
    },
    description: 'Список пользователей, связанных с аккаунтом',
  })
  users: object;

  @ApiProperty({
    example: {
      group1: { id: 100, title: 'Sales Team' },
    },
    description: 'Список групп, привязанных к аккаунту',
  })
  groups: object;

  @ApiProperty({
    example: {
      task1: { id: 1, name: 'Follow-up Call' },
    },
    description: 'Типы задач, доступные в аккаунте',
  })
  taskTypes: object;

  @ApiProperty({
    example: {
      pipeline1: { id: 10, name: 'Main Sales Pipeline' },
    },
    description: 'Список воронок продаж (pipelines)',
  })
  pipelines: object;

  @ApiProperty({
    example: {
      customField1: 'Some custom value',
    },
    description: 'Пользовательские поля, настроенные в аккаунте',
  })
  customFields: object;
}

export class AmoUpdateDto {
  @ApiProperty({
    example: 'Updated Amo Name',
    description: 'Название аккаунта AmoCRM',
  })
  name?: string;

  @ApiProperty({
    example: 'updatedsubdomain',
    description: 'Поддомен аккаунта AmoCRM',
  })
  subdomain?: string;

  @ApiProperty({
    example: true,
    description: 'Является ли аккаунт техническим',
  })
  isTech?: boolean;

  @ApiProperty({
    example: '2025-12-31T23:59:59.000Z',
    description: 'Дата окончания подписки',
    type: String,
    format: 'date-time',
  })
  paidTill?: Date;

  @ApiProperty({
    example: 'business',
    description: 'Название тарифного плана',
  })
  tariff?: string;

  @ApiProperty({
    type: () => info,
    description: 'Информация о регионе, валюте, языке и других параметрах',
  })
  info?: Info;

  @ApiProperty({
    example: { someKey: 'someUpdatedValue' },
    description: 'Объект с сырыми данными AmoCRM',
  })
  objectAmo?: object;

  @ApiProperty({
    example: {
      user2: { id: 2, name: 'User Two' },
    },
    description: 'Обновлённый список пользователей',
  })
  users?: object;

  @ApiProperty({
    example: {
      group2: { id: 200, title: 'Marketing Team' },
    },
    description: 'Обновлённый список групп',
  })
  groups?: object;

  @ApiProperty({
    example: {
      task2: { id: 2, name: 'Email Follow-up' },
    },
    description: 'Обновлённый список типов задач',
  })
  taskTypes?: object;

  @ApiProperty({
    example: {
      pipeline2: { id: 11, name: 'Secondary Pipeline' },
    },
    description: 'Обновлённый список воронок продаж',
  })
  pipelines?: object;

  @ApiProperty({
    example: {
      customField2: 'Updated custom value',
    },
    description: 'Обновлённые пользовательские поля',
  })
  customFields?: object;
}

export class AmoGetManyDto {
  @ApiProperty({
    example: 1,
    description: 'Номер страницы для пагинации (по умолчанию 1)',
  })
  page?: number;

  @ApiProperty({
    example: 20,
    description: 'Количество записей на странице (по умолчанию 20)',
  })
  limit?: number;

  name?: string;

  subdomain?: string;

  isTech?: boolean;

  tariff?: string;

  info?: Info;

  objectAmo?: object;

  users?: object;

  groups?: object;

  taskTypes?: object;

  pipelines?: object;

  customFields?: object;
}
