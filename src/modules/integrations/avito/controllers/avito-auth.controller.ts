import { Controller, Get, Query } from '@nestjs/common';
import { AvitoAuthService } from '../services/avito-auth.service';

@Controller('avito/auth')
export class AvitoAuthController {
  constructor(private authService: AvitoAuthService) {}

  @Get('start')
  startAuth(@Query('accountId') accountId: number) {
    return this.authService.getAuthUrl(accountId);
  }

  @Get('callback')
  async callback(
    @Query('accountId') accountId: number,
    @Query('code') code: string,
  ) {
    await this.authService.exchangeCode(accountId, code);
    return { message: 'Успешно авторизовано' };
  }
}
