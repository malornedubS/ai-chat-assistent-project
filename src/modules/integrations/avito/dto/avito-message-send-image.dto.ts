import { ApiProperty } from '@nestjsx/crud/lib/crud';

export class AvitoMessageSendImageDto {
  @ApiProperty({ description: 'ID пользователя Avito', example: 418842707 })
  userId: number;

  @ApiProperty({
    description: 'ID чата',
    example: 'u2i-V4CPKZfxPpJB00WwcY842w',
  })
  chatId: string;

  @ApiProperty({
    description: 'Файл изображения',
    type: 'string',
    format: 'binary',
  })
  file: any;
}
