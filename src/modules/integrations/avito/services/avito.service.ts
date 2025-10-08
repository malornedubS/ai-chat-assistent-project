import { BadRequestException, Injectable } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
// import { BotService } from 'src/modules/bots/services/bots.service';
import { AvitoTokensService } from './avito-token.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
// import { AvitoMessageSendDto } from '../dto/avito-message-send.dto';
import { AvitoMessagesGetStoryDto } from '../dto/avito-messages-get-story.dto';
import { AvitoStoryMessagesResponse } from 'src/shared/api/avito-api/types/avito-message-types';
import { AvitoUploadImageDto } from '../dto/avito-upload-image.dto';
// import { AvitoSendImageMessageDto } from '../dto/avito-message-send-image.dto';
import { AvitoMessageSendDto } from '../dto/avito-message-send.dto';
import { AvitoMessageResponseDto } from '../dto/avito-message-send-type.dto';
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

  async sendMessage(
    dto: AvitoMessageSendDto,
  ): Promise<AvitoMessageResponseDto> {
    if (dto.text && dto.imageId?.length)
      throw new BadRequestException('Отправьте либо текст, либо изображение'); // можно ли так делать? или это лучше выносить в другие места?

    if (!dto.text && !dto.imageId?.length)
      throw new BadRequestException('Укажите текст или изображение');

    const token = await this.tokensService.getToken(dto.userId);
    const avitoApi = new AvitoApi(token, this.loki);

    try {
      if (dto.text) {
        const result = await avitoApi.sendMessage({
          userId: dto.userId,
          chatId: dto.chatId,
          text: dto.text,
        });
        this.loki.log(
          `Ответ отправлен в чат ${dto.chatId}, Текст: ${result.content.text}`,
        );
        return result;
      } else {
        const result = await avitoApi.sendImageMessage({
          userId: dto.userId,
          chatId: dto.chatId,
          imageId: dto.imageId,
        });
        this.loki.log(`Изображение отправлено в чат ${dto.chatId}`);
        return result;
      }
    } catch (error) {
      this.loki.error('Ошибка Avito API', error);
      throw error;
    }
  }
  /**
   * Загрузка изображения на сервер Avito
   */
  async uploadImage(
    dto: AvitoUploadImageDto,
  ): Promise<{ imageId: string; url: string }> {
    if (dto.file.size > 24 * 1024 * 1024)
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

    return { imageId, url };
  }
  /**
   * Полученить историю сообщений из чата Avito
   */
  async getStoryMessages(
    dto: AvitoMessagesGetStoryDto,
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

  // /**
  //  * Отправка сообщения в чат Avito
  //  */
  // async sendMessage(dto: AvitoMessageSendDto): Promise<AvitoMessageResponse> {
  //   const token = await this.tokensService.getToken(dto.userId);
  //   const avitoApi = new AvitoApi(token, this.loki);
  //   if (!dto.text) {
  //     throw new BadRequestException('Текст сообщения обязателен');
  //   }
  //   try {
  //     const result = await avitoApi.sendMessage({
  //       userId: dto.userId,
  //       chatId: dto.chatId,
  //       text: dto.text,
  //     });

  //     this.loki.log(
  //       `Ответ отправлен в чат ${dto.chatId}, Текст: ${result.content.text}`,
  //     );
  //     return result;
  //   } catch (error) {
  //     this.loki.error('Ошибка Avito API', error);
  //     throw error;
  //   }
  // }
  // /**
  //  * Отправка изображения в чат Avito
  //  */
  // async sendImageMessage(
  //   dto: AvitoSendImageMessageDto,
  // ): Promise<AvitoImageMessageResponse> {
  //   if (!dto.imageId?.length) {
  //     throw new BadRequestException('Не указаны imageIds');
  //   }
  //   try {
  //     const token = await this.tokensService.getToken(dto.userId);
  //     const avitoApi = new AvitoApi(token, this.loki);

  //     const result = await avitoApi.sendImageMessage({
  //       userId: dto.userId,
  //       chatId: dto.chatId,
  //       imageId: dto.imageId,
  //     });

  //     this.loki.log(`Изображение отправлено в чат ${dto.chatId}`);
  //     return result;
  //   } catch (error) {
  //     this.loki.error('Ошибка Avito API', error);
  //     throw error;
  //   }
  // }

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
