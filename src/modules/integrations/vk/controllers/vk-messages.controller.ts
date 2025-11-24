import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { VkService } from '../services/vk.service';
import { VkSendMessageDto } from '../dto/vk-send-message.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('vk/messages')
@ApiTags('vk/messages')
export class VkMessagesController {
  constructor(private readonly vkService: VkService) {}

  @Post('send')
  @UseInterceptors(FileInterceptor('attachments'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: VkSendMessageDto })
  sendMessage(@Body() dto: VkSendMessageDto, @UploadedFile() file?: Express.Multer.File) {
    return this.vkService.sendMessage(dto, file);
  }
}
