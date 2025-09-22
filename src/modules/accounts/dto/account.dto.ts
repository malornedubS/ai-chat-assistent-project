import { ApiProperty } from '@nestjsx/crud/lib/crud';

export class AccountCreateDto {
  @ApiProperty({
    example: 'Main Account',
    description: 'Название аккаунта',
  })
  name: string;
}

export class AccountUpdateDto {
  @ApiProperty({
    example: 'Main Account',
    description: 'Название аккаунта',
  })
  name?: string;
}

export class AccountsGetManyDto {
  @ApiProperty({
    example: 1,
    description: 'Номер страницы для пагинации (по умолчанию 1)',
  })
  page?: number;

  @ApiProperty({
    example: 20,
    description: 'Количество записей на странице (по умолчанию 20)',
  })
  limit?: number;
  id?: number;
  name?: string;
  amoAccount?: number;
}
