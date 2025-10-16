import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class AvitoMessageSendTextDto {
  @ApiProperty({ description: 'ID пользователя Avito', example: 418842707 })
  userId: number;

  @ApiProperty({
    description: 'ID чата',
    example: 'u2i-V4CPKZfxPpJB00WwcY842w',
  })
  chatId: string;

  @ApiPropertyOptional({
    description: 'Текст сообщения',
    example: 'Привет!Это тест?',
  })
  text: string;
}
