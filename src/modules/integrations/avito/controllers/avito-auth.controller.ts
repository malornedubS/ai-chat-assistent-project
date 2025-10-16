import { Controller, Get, Query } from '@nestjs/common';
import { AvitoAuthService } from '../services/avito-auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('avito/auth')
@ApiTags('avito/auth')
export class AvitoAuthController {
  constructor(private authService: AvitoAuthService) {}

  @Get('start')
  startAuth(@Query('accountId') accountId: number) {
    return this.authService.getAuthUrl(accountId);
  }

  @Get('callback')
  async callback(@Query('state') state: string, @Query('code') code: string) {
    const accountId = parseInt(state.split('-')[0]);

    console.log('Аккаунт нашей системы:', accountId);

    await this.authService.exchangeCode(accountId, code);
    return { message: 'Успешно авторизовано' };
  }
}
