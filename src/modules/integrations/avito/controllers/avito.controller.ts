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
import { SendMessageDto } from '../dto/send-message.dto';
import { GetStoryMessagesDto } from '../dto/get-story-messages.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendImageMessageDto } from '../dto/send-image-message.dto';

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
  async sendMessage(@Body() dto: SendMessageDto) {
    return this.avitoService.sendMessage(dto);
  }
  // Отправить изображение в Avito
  @Post('send-image-message')
  @ApiOperation({ summary: 'Отправить изображение в Avito' })
  async sendImageMessage(@Body() dto: SendImageMessageDto) {
    return this.avitoService.sendImageMessage(dto);
  }
  // Получить историю сообщений
  @Get('get-story-messages')
  @ApiOperation({ summary: 'Получить историю сообщений' })
  async getChatMessages(@Query() dto: GetStoryMessagesDto) {
    return this.avitoService.getStoryMessages(dto);
  }
  // Загрузка изображения на сервер Аvito
  @Post('upload-image')
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

  // Получить токен
  @Post('get-token')
  @ApiOperation({ summary: 'Получить токен' })
  async getToken() {
    return AvitoApi.getAccessToken();
  }
}
