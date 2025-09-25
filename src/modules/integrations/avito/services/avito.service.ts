import { Injectable } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
// import { BotService } from 'src/modules/bots/services/bots.service';
import { AvitoTokensService } from './avito-token.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { CreateSendMessageDto } from '../dto/create-send-message.dto';
import { GetStoryMessagesDto } from '../dto/get-story-messages.dto';
import { AvitoMessagesResponse } from 'src/shared/api/avito-api/avito-types/avito-types';
// import { AvitoWebhookDto } from 'src/modules/integrations/avito/dto/avito-webhook.dto';
// import { repl } from '@nestjs/core';

@Injectable()
export class AvitoService {
  constructor(
    // private readonly botService: BotService,
    private readonly tokensService: AvitoTokensService,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(AvitoService.name);
  }

  /**
   * Отправка сообщения в чат Avito
   */
  async sendMessage(dto: CreateSendMessageDto): Promise<void> {
    try {
      const token = await this.tokensService.getToken(dto.userId);
      const avitoApi = new AvitoApi(token, this.loki);
      if (dto.text) {
        await avitoApi.sendMessage({
          userId: dto.userId,
          chatId: dto.chatId,
          text: dto.text,
        });
        this.loki.log(`Ответ отправлен в чат ${dto.chatId}`);
      }
    } catch (error) {
      this.loki.error('Ошибка ', { error: error.stack });
      throw error;
    }
  }

  /**
   * Полученить историю сообщений из чата Avito
   */
  async getStoryMessages(
    dto: GetStoryMessagesDto,
  ): Promise<AvitoMessagesResponse> {
    try {
      const token = await this.tokensService.getToken(dto.userId);
      const avitoApi = new AvitoApi(token, this.loki);
      return avitoApi.getChatMessages(dto);
    } catch (error) {
      this.loki.error('Ошибка ', { error: error.stack });
      throw error;
    }
  }

  //   /**
  //    * Обработка вебхука от Avito
  //    */
  //   async processWebhook(webhook: AvitoWebhookDto): Promise<void> {
  //     try {
  //       // 1. Извлекаем данные из вебхука
  //       const chatId = webhook.payload.value.chat_id;
  //       const userId = webhook.payload.value.user_id;
  //       const text = webhook.payload.value.content.text;

  //       if (!chatId || !text) {
  //         this.loki.warn('Webhook не содержит chatId или текста сообщения');
  //         return;
  //       }

  //       // 2. Передаём сообщение в бота
  //       const reply = await this.botService.processMessages({
  //         chatId,
  //         text,
  //         role: 'user',
  //         source: 'avito',
  //         accountId: userId,
  //       });

  //       // 3. Получаем токен для API Авито
  //       const token = await this.tokensService.getToken(userId);

  //       // 4. Создаём Avito API клиент
  //       const avitoApi = new AvitoMessageApi(token, this.loki);

  //       // 5. Отправляем ответ GPT в Авито чат
  //       if (reply?.text) {
  //         await avitoApi.sendMessage({
  //           userId: userId,
  //           chatId: chatId,
  //           text: reply.text,
  //         });
  //         this.loki.log(`Ответ отправлен в чат ${chatId}`);
  //       }
  //     } catch (error) {
  //       this.loki.error('Ошибка в processWebhook', { error: error.stack });
  //     }
  //   }
}
