import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { MessageCreateDto } from '../dto/message-create.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessageService) {}
  @Post()
  @ApiOperation({ summary: 'Создание нового сообщения' })
  @ApiBody({
    type: MessageCreateDto,
    description: 'Данные для создания нового сообщения',
  })
  async createMessage(@Body() messageData: MessageCreateDto) {
    return this.messagesService.saveIncomigMessage(messageData);
  }
}
