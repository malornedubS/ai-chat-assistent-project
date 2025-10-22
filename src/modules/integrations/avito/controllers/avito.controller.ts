import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AvitoService } from '../services/avito.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AvitoMessagesGetStoryDto } from '../dto/avito-messages-get-story.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvitoMessageSendDto } from '../dto/avito-message-send.dto';

@Controller('avito')
@ApiTags('avito')
export class AvitoController {
  constructor(private readonly avitoService: AvitoService) {}

  // Отправить сообщение в чат Avito
  @Post('message/send')
  @ApiOperation({ summary: 'Отправить сообщение в чат Avito' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: AvitoMessageSendDto,
  })
  async sendMessage(@Body() body: Omit<AvitoMessageSendDto, 'file'>, @UploadedFile() file: Express.Multer.File) {
    return this.avitoService.sendMessage({
      ...body,
      file,
    });
  }

  // Получить историю сообщений
  @Get('message/story')
  @ApiOperation({ summary: 'Получить историю сообщений' })
  async getChatMessages(@Query() dto: AvitoMessagesGetStoryDto) {
    return this.avitoService.getStoryMessages(dto);
  }

  // Получить токен
  @Get('/token')
  @ApiOperation({ summary: 'Получить токен' })
  async getToken() {
    return AvitoApi.getAccessToken();
  }
}
