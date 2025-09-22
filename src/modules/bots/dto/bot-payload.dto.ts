import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { AI_TOOLS } from 'config/constants';
import { ChatGptRole } from 'src/modules/chat-gpt/dto/chat-gpt-create.dto';

export type MessageSourceType =
  (typeof AI_TOOLS.INTEGRATIONS)[keyof typeof AI_TOOLS.INTEGRATIONS];

export class BotPayloadDto {
  @ApiProperty({ description: 'ID аккаунта', required: false })
  @IsOptional()
  @IsNumber()
  accountId?: number;

  @ApiProperty({ description: 'ID чата' })
  @IsString()
  chatId: string;

  @ApiProperty({ description: 'ID бота', required: false })
  @IsOptional()
  @IsString()
  botId?: string;

  @ApiProperty({ description: 'Текст сообщения' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Роль отправителя', default: 'user' })
  @IsOptional()
  @IsString()
  role: ChatGptRole;

  @ApiProperty({
    description: 'Источник сообщения',
    enum: Object.values(AI_TOOLS.INTEGRATIONS),
  })
  @IsIn(Object.values(AI_TOOLS.INTEGRATIONS))
  source: MessageSourceType;
}
