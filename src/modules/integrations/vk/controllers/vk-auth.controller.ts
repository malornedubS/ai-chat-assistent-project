import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VkAuthService } from '../services/vk-auth.service';
import { LokiLogger } from 'gnzs-platform-modules';

@Controller('vk/oauth2')
@ApiTags('vk/oauth2')
export class VkAuthController {
  constructor(private readonly vkAuthService: VkAuthService, private readonly loki: LokiLogger) {}

  @Get('connect/user')
  @ApiOperation({ summary: 'Подключение VK -  URL для авторизации' })
  async connectVK(@Query('accountId') accountId: number) {
    const { authUrl } = this.vkAuthService.getAuthUrl(accountId);
    return { authUrl };
  }

  @Get('connect/group')
  @ApiOperation({ summary: 'Подключение VK группы -  URL для авторизации' })
  async getGroupConnectUrl(@Query('vkUserId') vkUserId: number, @Query('groupId') groupId: number) {
    return this.vkAuthService.getGroupAuthUrl(vkUserId, groupId);
  }

  @Get('callback/user')
  async vkCallback(@Query('code') code: string, @Query('state') state: string, @Query('device_id') deviceId: string) {
    const tokens = await this.vkAuthService.exchangeUserCode(code, state, deviceId);
    return {
      message: 'Токены получены',
      tokens,
    };
  }

  @Get('callback/group')
  async groupCallback(@Query('code') code: string, @Query('state') state: string) {
    return this.vkAuthService.exchangeGroupCode(code, state);
  }
}
