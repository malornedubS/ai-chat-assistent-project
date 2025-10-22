import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AmoCreateDto, AmoGetManyDto, AmoUpdateDto } from './dto/amo-account.dto';
import { AmoAccountsService } from './amo-accounts.service';

@Controller('/amo-accounts')
@ApiTags('amo-accounts')
export class AmoAccountsController {
  constructor(private readonly service: AmoAccountsService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Получить амо-аккаунт по Id' })
  getOne(@Param('id') id: string) {
    return this.service.getOne(+id);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получить несколько амо-аккаунтов' })
  getMany(@Query() query: AmoGetManyDto) {
    return this.service.getMany(query);
  }

  @Post('/')
  @ApiOperation({ summary: 'Создать запись амо-аккаунта' })
  create(@Body() body: AmoCreateDto) {
    return this.service.create(body);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Обновить амо-аккаунт ' })
  @ApiBody({ type: AmoUpdateDto })
  update(@Param('id') id: string, @Body() body: AmoUpdateDto) {
    return this.service.update(+id, body);
  }
}
