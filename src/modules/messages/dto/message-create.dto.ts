import { IsString, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatGptRole } from 'src/modules/chat-gpt/dto/chat-gpt-create.dto';
import { AI_TOOLS } from 'config/constants';

export class MessageCreateDto {
  @ApiProperty({
    description: 'ID бота, к которому относится сообщение',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  botId: string;

  @ApiProperty({
    description: 'Уникальный идентификатор чата',
    example: '48484b38-166e-434d-89e1-7865bbeface2',
  })
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @ApiProperty({
    description: 'Роль отправителя сообщения',
    examples: {
      user: { value: 'user', description: 'Сообщение от пользователя' },
    },
  })
  @IsNotEmpty()
  role: ChatGptRole;

  @ApiProperty({
    description: 'Текст сообщения',
    example: 'Привет! Как дела?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsEnum(Object.values(AI_TOOLS.INTEGRATIONS))
  source: (typeof AI_TOOLS.INTEGRATIONS)[keyof typeof AI_TOOLS.INTEGRATIONS];
}
