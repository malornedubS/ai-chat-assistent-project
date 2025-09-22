import { Body, Controller, Post } from '@nestjs/common';
import { ChatGptCreateDto } from '../dto/chat-gpt-create.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { BotService } from 'src/modules/bots/services/bots.service';
import { MessageCreateDto } from 'src/modules/messages/dto/message-create.dto';
import { Messages } from 'src/modules/messages/entity/messages.entity';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly botService: BotService) {}
  @Post()
  @ApiOperation({ summary: 'Отправить сообщение в ChatGPT' })
  @ApiBody({ type: ChatGptCreateDto })
  async sendMessage(@Body() dto: MessageCreateDto): Promise<Messages> {
    return this.botService.processMessages(dto);
  }
}
