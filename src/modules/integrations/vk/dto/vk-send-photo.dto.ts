import { ApiProperty } from '@nestjs/swagger';

export class SendPhotoDto {
  @ApiProperty({
    description: 'ID пользователя VK',
    example: '280277969',
  })
  vkUserId: number;

  @ApiProperty({
    description: 'ID получателя',
    example: '280277969',
  })
  peerId: number;
}

export class SendPhotoResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  result: any;
}
