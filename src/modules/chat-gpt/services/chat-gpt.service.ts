import { Injectable } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
import OpenAI from 'openai';
import { ChatGptResponseDto } from '../dto/chat-gpt-response.dto';
import { ChatGptMessageDto } from '../dto/chat-gpt-create.dto';
import { ChatGptTokenizerService } from 'src/modules/chat-gpt/services/chat-gpt-tokenizer.service';
import { Bot } from 'src/modules/bots/entities/bot.entity';

@Injectable()
export class ChatGptService {
  private readonly client: OpenAI;

  constructor(private readonly loki: LokiLogger, private readonly tokenizerService: ChatGptTokenizerService) {
    this.loki.setContextName(ChatGptService.name);

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateMessage(config: Bot, messages: ChatGptMessageDto[]): Promise<ChatGptResponseDto> {
    // 1. Подсчет токенов
    const tokens = await this.tokenizerService.countTokens(messages, config.instructions, config.model);
    console.log(`Использовано токенов: ${tokens}`);

    if (tokens > config.maxOutputTokens) {
      throw new Error(`Превышен лимит токенов: ${tokens} > ${config.maxOutputTokens}`);
    }

    // 2. Формирование запроса
    const chatGptDto = {
      model: config.model,
      instructions: config.instructions,
      input: messages,
      max_output_tokens: config.maxOutputTokens,
      temperature: config.temperature,
    };

    // 3. Отправка запроса в OpenAI
    try {
      const response = await this.client.responses.create(chatGptDto);
      return response;
    } catch (error) {
      this.loki.error('Ошибка OpenAI API:', error);
      throw error;
    }
  }
}
