import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum VkAttachmentType {
  PHOTO = 'photo',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOC = 'doc',
  WALL = 'wall',
  MARKET = 'market',
  POLL = 'poll',
  QUESTION = 'question',
}

export class VkSendMessageDto {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  vkUserId: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  peerId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  attachments?: VkAttachmentDto[];
}

export class VkAttachmentDto {
  @ApiProperty({ enum: VkAttachmentType })
  @IsString()
  type: VkAttachmentType;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  ownerId: number;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  mediaId: number;

  @IsOptional()
  @IsString()
  accessKey?: string;
}
