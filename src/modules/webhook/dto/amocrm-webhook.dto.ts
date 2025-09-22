import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
  AmoElementEnum,
  AmoEntityEnum,
  AuthorEnum,
  MessageDirectionEnum,
} from './enums.dto';

export class AccountLinksDto {
  @IsString()
  @ApiProperty({ type: String })
  self: string;
}

export class AmoAccountDto {
  @ApiProperty({ description: 'Поддомен аккаунта' })
  @IsString()
  subdomain: string;

  @ApiProperty({ description: 'ID аккаунта' })
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => AccountLinksDto)
  @ApiProperty({ type: AccountLinksDto, description: 'Ссылки аккаунта' })
  _links: AccountLinksDto;
}

export class MessageAuthorDto {
  @ApiProperty({ description: 'ID автора сообщения' })
  id: string;

  @ApiProperty({
    enum: AuthorEnum,
    enumName: 'AuthorEnum',
    description: 'Тип автора сообщения',
  })
  type: AuthorEnum;

  @ApiProperty({ description: 'Имя автора' })
  name: string;

  @ApiPropertyOptional({ description: 'URL аватара автора' })
  avatar_url?: string;
}

export class MessageAddItemDto {
  @ApiProperty({ description: 'ID сообщения' })
  id: string;

  @ApiProperty({ description: 'ID чата' })
  chat_id: string;

  @ApiProperty({ description: 'ID беседы' })
  talk_id: string;

  @ApiProperty({ description: 'ID контакта' })
  contact_id: string;

  @ApiProperty({ description: 'Текст сообщения' })
  text: string;

  @ApiProperty({ description: 'Дата и время создания сообщения' })
  created_at: string;

  @ApiProperty({
    enum: AmoElementEnum,
    enumName: 'AmoElementEnum',
    description: 'Тип элемента в AmoCRM',
  })
  element_type: AmoElementEnum;

  @ApiProperty({
    enum: AmoEntityEnum,
    enumName: 'AmoEntityEnum',
    description: 'Тип сущности в AmoCRM',
  })
  entity_type: AmoEntityEnum;

  @ApiProperty({ description: 'ID элемента' })
  element_id: string;

  @ApiProperty({ description: 'ID сущности' })
  entity_id: string;

  @ApiProperty({
    enum: MessageDirectionEnum,
    enumName: 'MessageDirectionEnum',
    description: 'Направление сообщения',
  })
  type: MessageDirectionEnum;

  @ApiProperty({ type: MessageAuthorDto, description: 'Автор сообщения' })
  @ValidateNested()
  @Type(() => MessageAuthorDto)
  author: MessageAuthorDto;

  @ApiProperty({ description: 'Источник сообщения в формате amo.ext.{number}' })
  origin: string;
}

export class AmoMessageDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageAddItemDto)
  @ApiProperty({
    type: [MessageAddItemDto],
    description: 'Массив добавляемых сообщений',
  })
  add: MessageAddItemDto[];
}

export class AmoWebhookDto {
  @ApiProperty({ type: AmoAccountDto, description: 'Аккаунт AmoCRM' })
  @ValidateNested()
  @Type(() => AmoAccountDto)
  account: AmoAccountDto;

  @ApiProperty({ type: AmoMessageDto, description: 'Данные сообщения' })
  @ValidateNested()
  @Type(() => AmoMessageDto)
  message: AmoMessageDto;
}
