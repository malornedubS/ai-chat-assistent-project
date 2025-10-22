import { Injectable } from '@nestjs/common';
import { ChatGptRole } from 'src/modules/chat-gpt/dto/chat-gpt-create.dto';
import { ChatGptService } from 'src/modules/chat-gpt/services/chat-gpt.service';
import { Messages } from 'src/modules/messages/entity/messages.entity';
import { MessageService } from 'src/modules/messages/services/message.service';

import { Repository } from 'typeorm';
import { BotPayloadDto } from '../dto/bot-payload.dto';
import { Bot } from '../entities/bot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageCreateDto } from 'src/modules/messages/dto/message-create.dto';

@Injectable()
export class BotService {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatGptService: ChatGptService,
    @InjectRepository(Bot)
    private readonly botsRepository: Repository<Bot>,
  ) {}

  async processMessages(payload: BotPayloadDto): Promise<Messages> {
    // 1. Получаем конфиг из БД
    const config = await this.getBotByAccountId(payload.accountId);
    const incomingMessageData: MessageCreateDto = {
      text: payload.text,
      chatId: payload.chatId,
      role: payload.role,
      botId: config.id,
      source: payload.source,
    };
    await this.messageService.saveIncomigMessage(incomingMessageData);

    const history = await this.messageService.getChatHistory(payload.chatId);
    const inputMessages = history.map((message) => ({
      role: message.role as ChatGptRole,
      content: message.text,
    }));

    const outputMessages = await this.chatGptService.generateMessage(config, inputMessages);

    // 4. Сохраняем ответ ИИ
    const aiMsg = await this.messageService.saveOutgoingMessage({
      botId: config.id,
      chatId: payload.chatId,
      role: 'assistant',
      text: outputMessages.output_text,
      source: payload.source,
    });

    return aiMsg;
  }

  async getBotByAccountId(accountId: number): Promise<Bot> {
    let bot = await this.botsRepository.findOne({ where: { accountId } });
    if (!bot) {
      bot = this.botsRepository.create({
        accountId,
        model: 'gpt-4o-mini',
        instructions: 'Ты вежливый помощник',
        maxOutputTokens: 1000,
        temperature: 0.7,
      });
      await this.botsRepository.save(bot);
    }
    return bot;
  }
}
