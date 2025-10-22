import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountCreateDto, AccountsGetManyDto, AccountUpdateDto } from './dto/account.dto';
import { AccountsService } from './accounts.service';

@Controller('/accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Получить аккаунт по Id' })
  getOne(@Param('id') id: string) {
    return this.service.getOne(+id);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получить несколько аккаунтов' })
  getMany(@Query() query: AccountsGetManyDto) {
    return this.service.getMany(query);
  }

  @Post('/')
  @ApiOperation({ summary: 'Создать запись аккаунта' })
  create(@Body() body: AccountCreateDto) {
    return this.service.create(body);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Обновить аккаунт ' })
  update(@Param('id') id: string, @Body() body: AccountUpdateDto) {
    return this.service.update(+id, body);
  }
}
