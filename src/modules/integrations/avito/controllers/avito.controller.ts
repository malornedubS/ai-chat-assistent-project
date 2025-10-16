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
import { AvitoMessageSendTextDto } from '../dto/avito-message-send-text.dto';
import { AvitoMessageSendImageDto } from '../dto/avito-message-send-image.dto';

@Controller('avito')
@ApiTags('avito/message')
export class AvitoController {
  constructor(private readonly avitoService: AvitoService) {}

  // Отправить сообщение в Avito
  @Post('message/send/text')
  @ApiOperation({ summary: 'Отправить сообщение в Avito' })
  async sendMessage(@Body() dto: AvitoMessageSendTextDto) {
    return this.avitoService.sendTextMessage(dto);
  }

  // Отправить изображение в Avito
  @Post('message/send/image')
  @ApiOperation({ summary: 'Отправить изображение в чат Avito' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AvitoMessageSendImageDto })
  async sendImageMessage(
    @Body() body: Omit<AvitoMessageSendImageDto, 'file'>,
    @UploadedFile() file: any,
  ) {
    return this.avitoService.sendImageMessage({
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
