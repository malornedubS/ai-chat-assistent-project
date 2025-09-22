import { ApiProperty } from '@nestjsx/crud/lib/crud';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export type ChatGptRole = 'user' | 'assistant' | 'system';

export class ChatGptMessageDto {
  @ApiProperty({
    description: 'Роль отправителя сообщения',
    examples: ['user', 'assistant', 'system'],
    default: 'user',
  })
  @IsEnum(['user', 'assistant', 'system'])
  @IsNotEmpty()
  role: ChatGptRole;

  @IsString()
  content: string;
}
export class BotFunctionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
export class ChatGptCreateDto {
  @ApiProperty({
    description: 'Модель ИИ, которую нужно использовать',
    example: 'gpt-4o',
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'Системные инструкции — определяют поведение ассистента',
    example:
      'Ты — вежливый помощник в интернет-магазине. Отвечай кратко и по делу.',
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({
    description: 'История диалога: массив сообщений (role + content)',
    example: [
      { role: 'system', content: 'Ты — помощник.' },
      { role: 'user', content: 'Сколько стоит доставка?' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  messages: ChatGptMessageDto[];

  @ApiProperty({
    description: 'Максимальное количество токенов в ответе',
    example: 1024,
    minimum: 1,
    maximum: 4096,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  max_output_tokens?: number;

  @ApiProperty({
    description:
      'Параметр температуры: креативность ответа (0 = строго, 2 = креативно)',
    example: 0.7,
    minimum: 0,
    maximum: 2,
    default: 0.7,
  })
  @IsOptional()
  @IsNumber()
  temperature?: number;
}
