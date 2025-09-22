import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AvitoWebhookDto {
  @ApiProperty({ description: 'ID события' })
  id: string;

  @ApiProperty({ description: 'Время события (timestamp)' })
  timestamp: number;

  @ApiProperty({ description: 'Версия API' })
  version: string;

  @ApiProperty({ type: () => AvitoPayloadDto, description: 'Пейлоад события' })
  @Type(() => AvitoPayloadDto)
  payload: AvitoPayloadDto;
}

export class AvitoPayloadDto {
  @ApiProperty({ description: 'Тип события, например "message"' })
  type: string;

  @ApiProperty({
    type: () => AvitoPayloadValueDto,
    description: 'Значение события',
  })
  @Type(() => AvitoPayloadValueDto)
  value: AvitoPayloadValueDto;
}

export class AvitoPayloadValueDto {
  @ApiProperty({ description: 'ID автора сообщения' })
  author_id: number;

  @ApiProperty({ description: 'ID чата' })
  chat_id: string;

  @ApiProperty({ description: 'Тип чата' })
  chat_type: string;

  @ApiProperty({
    type: () => AvitoContentDto,
    description: 'Содержимое сообщения',
  })
  @Type(() => AvitoContentDto)
  content: AvitoContentDto;

  @ApiProperty({ description: 'Дата создания (timestamp)' })
  created: number;

  @ApiProperty({ description: 'ID сообщения' })
  id: string;

  @ApiPropertyOptional({ description: 'ID объявления' })
  item_id: number;

  @ApiProperty({ description: 'Дата публикации ISO' })
  published_at: string;

  @ApiPropertyOptional({ description: 'Статус прочтения' })
  read: number;

  @ApiProperty({ description: 'Тип сообщения' })
  type: string;

  @ApiProperty({ description: 'ID пользователя' })
  user_id: number;
}

export class AvitoContentDto {
  @ApiPropertyOptional({ description: 'Информация о звонке' })
  call?: Record<string, any>;

  @ApiPropertyOptional({ description: 'ID сценария Avito' })
  flow_id?: string;

  @ApiPropertyOptional({ description: 'Информация о картинке' })
  image?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Информация о товаре' })
  item?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Ссылка' })
  link?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Локация' })
  location?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Текст сообщения' })
  text?: string;

  @ApiPropertyOptional({ description: 'Голосовое сообщение' })
  voice?: Record<string, any>;
}
