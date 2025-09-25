import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AvitoService } from '../services/avito.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSendMessageDto } from '../dto/create-send-message.dto';
import { GetStoryMessagesDto } from '../dto/get-story-messages.dto';

@ApiTags('avito')
@Controller('avito')
export class AvitoController {
  constructor(
    private readonly avitoService: AvitoService,
    private readonly api: AvitoApi,
  ) {}
  // Отправить сообщение в Avito
  @Post('send-message')
  @ApiOperation({ summary: 'Отправить сообщение в Avito' })
  async sendMessage(@Body() dto: CreateSendMessageDto) {
    return this.avitoService.sendMessage(dto);
  }
  // Получить историю сообщений
  @Get('get-story-messages')
  @ApiOperation({ summary: 'Получить историю сообщений' })
  async getChatMessages(@Query() dto: GetStoryMessagesDto) {
    return this.avitoService.getStoryMessages(dto);
  }
  // Получить токен
  @Post('get-token')
  @ApiOperation({ summary: 'Получить токен' })
  async getToken() {
    return AvitoApi.getAccessToken();
  }
}
