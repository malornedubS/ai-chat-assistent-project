import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { VkService } from '../services/vk.service';
import { VkSendMessageDto } from '../dto/vk-send-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LokiLogger } from 'gnzs-platform-modules';

@Controller('vk/messages')
@ApiTags('vk/messages')
export class VkMessagesController {
  constructor(private readonly vkService: VkService, private readonly loki: LokiLogger) {}

  @Post('/send')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        vkUserId: { type: 'number' },
        peerId: { type: 'number' },
        text: { type: 'string' },
      },
    },
  })
  async sendMessage(@UploadedFile() file: Express.Multer.File, @Body() dto: VkSendMessageDto) {
    return this.vkService.sendMessage(dto, file);
  }
}
