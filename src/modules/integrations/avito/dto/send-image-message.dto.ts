import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendImageMessageDto {
  @ApiProperty({ description: 'ID пользователя Avito', example: 418842707 })
  userId: number;

  @ApiProperty({
    description: 'ID чата',
    example: 'u2i-V4CPKZfxPpJB00WwcY842w',
  })
  chatId: string;

  @ApiPropertyOptional({
    description: 'Список ID изображений, загруженных в Avito',
    type: [String],
    example: ['47736874135.520ac30e0bd3433b873639bd5d6eaa2a'],
  })
  imageIds: string[];
}
