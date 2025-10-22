import { Injectable } from '@nestjs/common';
import { AI_TOOLS } from 'config/constants';
import { LokiLogger } from 'gnzs-platform-modules';
import { BotPayloadDto } from 'src/modules/bots/dto/bot-payload.dto';
import { BotService } from 'src/modules/bots/services/bots.service';
import { ChatGptRole } from 'src/modules/chat-gpt/dto/chat-gpt-create.dto';
import { AmoWebhookDto } from 'src/modules/webhook/dto/amocrm-webhook.dto';

@Injectable()
export class AmoCrmService {
  constructor(private readonly botService: BotService, private readonly loki: LokiLogger) {
    this.loki.setContextName(AmoCrmService.name);
  }

  // метод обработки вебхука
  async processWebhook(webhook: AmoWebhookDto): Promise<void> {
    try {
      console.log('Получаем данные из вебхука', webhook);

      // Вытаскиваем данные
      const extractedData = this.extractAmoData(webhook);

      // Передаем в botService
      await this.botService.processMessages(extractedData);

      return;
    } catch (error) {
      this.loki.error('AmoCRM webhook error:', error.message);
      return;
    }
  }

  // Вытаскиваем нужные данные из вебхука amoCRM
  private extractAmoData(webhook: AmoWebhookDto): BotPayloadDto {
    if (!webhook.message || !webhook.message.add || webhook.message.add.length === 0) {
      throw new Error('Сообщения в вебхуке не найдены');
    }

    const messageData = webhook.message.add[0];
    return {
      accountId: parseInt(webhook.account.id),
      text: messageData.text,
      chatId: messageData.chat_id,
      source: AI_TOOLS.INTEGRATIONS.AMOCRM,
      role: 'user' as ChatGptRole,
    };
  }
}
