import { Body, Controller, Get, Param, Post, Put, Query, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { VkCreateDto, VkUpdateDto, VkUserGroupsResponseDto } from '../dto/vk-accounts.dto';
import { VkAccountsService } from '../services/vk-accounts.servie';

@Controller('vk/accounts')
@ApiTags('vk/accounts')
export class VkAccountsController {
  constructor(private readonly vkAccountService: VkAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать VK аккаунт' })
  @ApiBody({ type: VkCreateDto })
  create(@Body() body: VkCreateDto) {
    return this.vkAccountService.create(body, body.accountId);
  }

  @Get(':vkUserId')
  @ApiOperation({ summary: 'Получить VK аккаунт по vkUserId' })
  getOne(@Param('vkUserId') id: number) {
    return this.vkAccountService.getOne(+id);
  }

  @Put(':vkUserId')
  @ApiOperation({ summary: 'Обновить VK аккаунт' })
  @ApiBody({ type: VkUpdateDto })
  update(@Param('vkUserId') id: number, @Body() body: VkUpdateDto) {
    return this.vkAccountService.update(+id, body);
  }

  @Delete(':vkUserId')
  @ApiOperation({ summary: 'Удалить VK аккаунт' })
  delete(@Param('vkUserId') id: number) {
    return this.vkAccountService.delete(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Получить VK аккаунты нашего пользователя' })
  @ApiQuery({ name: 'accountId', required: true })
  getMany(@Query('accountId') accountId: number) {
    return this.vkAccountService.getByAccountId(+accountId);
  }

  @Get(':vkUserId/groups')
  @ApiOperation({ summary: 'Получить группы пользователя в VK' })
  @ApiParam({ name: 'vkUserId', description: 'ID пользователя в VK' })
  async getUserGroups(@Param('vkUserId') vkUserId: number): Promise<VkUserGroupsResponseDto[]> {
    return this.vkAccountService.getUserGroups(vkUserId);
  }
}
