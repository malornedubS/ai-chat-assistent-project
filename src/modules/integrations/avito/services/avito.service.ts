import { BadRequestException, Injectable } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
// import { BotService } from 'src/modules/bots/services/bots.service';
import { AvitoTokensService } from './avito-token.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { SendMessageDto } from '../dto/send-message.dto';
import { GetStoryMessagesDto } from '../dto/get-story-messages.dto';
import {
  AvitoImageMessageResponse,
  AvitoMessageResponse,
  AvitoStoryMessagesResponse,
} from 'src/shared/api/avito-api/avito-types/avito-types';
import { UploadImageDto } from '../dto/upload-image.dto';
import { SendImageMessageDto } from '../dto/send-image-message.dto';
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
  async sendMessage(dto: SendMessageDto): Promise<AvitoMessageResponse> {
    const token = await this.tokensService.getToken(dto.userId);
    const avitoApi = new AvitoApi(token, this.loki);
    if (!dto.text) {
      throw new BadRequestException('Текст сообщения обязателен'); //TODO: правильно ли что я так ошибку обрабатываю?
    }
    try {
      const result = await avitoApi.sendMessage({
        userId: dto.userId,
        chatId: dto.chatId,
        text: dto.text,
      });

      this.loki.log(
        `Ответ отправлен в чат ${dto.chatId}, Текст: ${result.content.text}`,
      );
      return result;
    } catch (error) {
      this.loki.error('Ошибка Avito API', error);
      throw error;
    }
  }
  /**
   * Отправка изображения в чат Avito
   */
  async sendImageMessage(
    dto: SendImageMessageDto,
  ): Promise<AvitoImageMessageResponse> {
    if (!dto.imageIds?.length) {
      throw new BadRequestException('Не указаны imageIds');
    }
    try {
      const token = await this.tokensService.getToken(dto.userId);
      const avitoApi = new AvitoApi(token, this.loki);

      const result = await avitoApi.sendImageMessage({
        userId: dto.userId,
        chatId: dto.chatId,
        imageIds: dto.imageIds,
      });

      this.loki.log(`Изображение отправлено в чат ${dto.chatId}`);
      return result;
    } catch (error) {
      this.loki.error('Ошибка Avito API', error);
      throw error;
    }
  }
  /**
   * Загрузка изображения на сервер Avito
   */
  async uploadImage(
    dto: UploadImageDto,
  ): Promise<{ image_id: string; url: string }> {
    if (dto.file.size > 24 * 1024 * 1024)
      //TODO:правильно ли я сделал такую проверку тут или ее можно делать где-то в другом месте?
      throw new Error('Файл слишком большой');

    const token = await this.tokensService.getToken(dto.userId);
    const avitoApi = new AvitoApi(token, this.loki);
    const response = await avitoApi.uploadImage(
      dto.userId,
      dto.file.buffer,
      dto.file.originalname,
    );

    const imageId = Object.keys(response)[0];
    const url = response[imageId]?.['640x480'];
    this.loki.log(
      `Изображение успешно загружено на сервер Avito, image_id=${imageId}`,
    );
    if (!imageId || !url) throw new Error('Invalid Avito response');

    return { image_id: imageId, url };
  }
  /**
   * Полученить историю сообщений из чата Avito
   */
  async getStoryMessages(
    dto: GetStoryMessagesDto,
  ): Promise<AvitoStoryMessagesResponse> {
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
