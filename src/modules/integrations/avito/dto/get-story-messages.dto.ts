import { ApiProperty } from '@nestjsx/crud/lib/crud';

export class GetStoryMessagesDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  chatId: string;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: string;
}
