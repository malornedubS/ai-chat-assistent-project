import { Bot } from '../entities/bot.entity';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

@ApiExtraModels(Bot)
export class BotCreateDto {
  @ApiProperty({
    description: 'Название бота',
    example: 'Бот поддержки',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Конфигурация бота: модель, инструкции, параметры генерации',
  })
  @ValidateNested()
  @Type(() => Bot)
  config: Bot;

  @ApiProperty({
    description: 'Описание бота',
    example: 'Обслуживает клиентов на этапе "Первый контакт"',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
