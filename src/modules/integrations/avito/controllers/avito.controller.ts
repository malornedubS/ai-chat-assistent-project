import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AvitoService } from '../services/avito.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AvitoMessagesGetStoryDto } from '../dto/avito-messages-get-story.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { AvitoMessageSendDto } from '../dto/avito-message-send.dto';

@Controller('avito')
@ApiTags('avito/message')
export class AvitoController {
  constructor(
    private readonly avitoService: AvitoService,
    private readonly api: AvitoApi,
  ) {}

  // Отправить сообщение в Avito
  @Post('message/send')
  @ApiOperation({ summary: 'Отправить сообщение в Avito' })
  async sendMessage(@Body() dto: AvitoMessageSendDto) {
    return this.avitoService.sendMessage(dto);
  }

  // Загрузка изображения на сервер Аvito
  @Post('message/upload/image')
  @ApiOperation({ summary: 'Загрузить изображение на сервер Avito' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['userId', 'file'],
    },
  })
  async uploadImage(@Body('userId') userId: number, @UploadedFile() file: any) {
    return this.avitoService.uploadImage({ userId, file });
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

  // // Отправить сообщение в Avito
  // @Post('/send/message')
  // @ApiOperation({ summary: 'Отправить сообщение в Avito' })
  // async sendMessage(@Body() dto: AvitoMessageSendDto) {
  //   return this.avitoService.sendMessage(dto);
  // }

  // // Отправить изображение в Avito
  // @Post('/send/image')
  // @ApiOperation({ summary: 'Отправить изображение в Avito' })
  // async sendImageMessage(@Body() dto: AvitoMessageSendImageDto) {
  //   return this.avitoService.sendImageMessage(dto);
  // }
}
