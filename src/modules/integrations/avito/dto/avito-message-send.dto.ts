import { ApiPropertyOptional } from '@nestjs/swagger';
import { ApiProperty } from '@nestjsx/crud/lib/crud';

export class AvitoMessageSendDto {
  @ApiProperty({ description: 'ID пользователя Avito', example: 418842707 })
  userId: number;

  @ApiProperty({
    description: 'ID чата',
    example: 'u2i-V4CPKZfxPpJB00WwcY842w',
  })
  chatId: string;

  @ApiPropertyOptional({ description: 'Текст сообщения' })
  text?: string;

  @ApiPropertyOptional({
    description: 'Файл изображения',
    type: 'string',
    format: 'binary',
  })
  file?: any;
}
