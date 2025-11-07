import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class VkUserDto {
  @ApiProperty({ description: 'ID пользователя VK' })
  @IsNumber()
  vkUserId: number;

  @ApiProperty({ description: 'Полное имя пользователя' })
  @IsString()
  fullName: string;
}

export class VkCreateDto {
  @ApiProperty({ description: 'ID аккаунта' })
  @IsNumber()
  accountId: number;

  @ApiProperty({ description: 'ID пользователя VK' })
  @IsNumber()
  vkUserId: number;

  @ApiProperty({ description: 'Полное имя пользователя' })
  @IsString()
  fullName: string;
}

export class VkUpdateDto {
  @ApiProperty({ description: 'ID аккаунта', required: false })
  @IsOptional()
  @IsNumber()
  accountId: number;

  @ApiProperty({ description: 'Полное имя пользователя', required: false })
  @IsOptional()
  @IsString()
  fullName: string;
}

export class VkUserGroupsResponseDto {
  groups: VkGroupDto[];
}

export class VkGroupDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  screen_name: string;

  @ApiProperty()
  is_closed: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  photo_50: string;

  @ApiProperty()
  photo_100: string;

  @ApiProperty()
  photo_200: string;
}
