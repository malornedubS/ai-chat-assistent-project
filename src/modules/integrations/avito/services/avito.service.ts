import { BadRequestException, Injectable } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
import * as utils from '../utils/avito-utils';
import { AvitoTokensService } from './avito-token.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { AvitoMessagesGetStoryDto } from '../dto/avito-messages-get-story.dto';
import { AvitoStoryMessagesResponse } from 'src/shared/api/avito-api/types/avito-message-types';
import { AvitoMessageImageDto } from '../dto/avito-message-image.dto';
import { AvitoMessageTextDto } from '../dto/avito-message-text.dto';
import { AvitoMessageResponseDto } from '../dto/avito-message-response.dto';
import { AvitoMessageSendDto } from '../dto/avito-message-send.dto';

@Injectable()
export class AvitoService {
  constructor(private readonly tokensService: AvitoTokensService, private readonly loki: LokiLogger) {
    this.loki.setContextName(AvitoService.name);
  }

  /**
   * Свитчер для отправки сообщений в Avito
   */
  async sendMessage(dto: AvitoMessageSendDto): Promise<AvitoMessageResponseDto> {
    const { userId, chatId, text, file } = dto;

    if (!text && !file) {
      throw new BadRequestException('Необходимо указать текст или изображение');
    }

    if (text && file) {
      throw new BadRequestException('Нельзя отправлять текст и изображение одновременно');
    }

    if (text) {
      return await this.sendTextMessage({ userId, chatId, text });
    }

    if (file) {
      return await this.sendImageMessage({ userId, chatId, file });
    }

    throw new BadRequestException('Неизвестный тип сообщения');
  }

  /**
   * Отправить сообщение в чат Avito
   */
  async sendTextMessage(dto: AvitoMessageTextDto): Promise<AvitoMessageResponseDto> {
    try {
      const avitoApi = await this.getAvitoApi(dto.userId);
      const { userId, chatId, text } = dto;
      const result = await avitoApi.sendMessage({ userId, chatId, text });

      this.loki.log(`Текст отправлен в чат ${dto.chatId}`);
      return result;
    } catch (error) {
      this.loki.error('Ошибка отправки текста в Avito:', { userId: dto.userId, chatId: dto.chatId, error: error.message });
    }
  }
  /**
   * Отправить изображение в чат Avito
   */
  async sendImageMessage(dto: AvitoMessageImageDto): Promise<AvitoMessageResponseDto> {
    const { userId, chatId, file } = dto;
    try {
      utils.checkingFileSize(file, 24);

      const avitoApi = await this.getAvitoApi(userId);

      // 1. Загружаем
      const uploadResponse = await avitoApi.uploadImage(userId, file.buffer, file.originalname);
      const imageId = Object.keys(uploadResponse)[0];
      if (!imageId) {
        throw new Error('Не удалось загрузить изображение в Avito');
      }
      this.loki.log(`Изображение загружено на Avito, imageId=${imageId}`);

      // 2. Отправляем
      const result = await avitoApi.sendImageMessage({ userId, chatId, imageId: imageId });

      this.loki.log(`Изображение отправлено в чат ${dto.chatId}`);

      return result;
    } catch (error) {
      this.loki.error('Ошибка отправки изображения в Avito:', {
        userId: dto.userId,
        chatId: dto.chatId,
        fileName: dto.file?.originalname,
        error: error.message,
      });
    }
  }

  private async getAvitoApi(userId: number): Promise<AvitoApi> {
    const token = await this.tokensService.getToken(userId);
    return new AvitoApi(token, this.loki);
  }
  /**
   * Полученить историю сообщений из чата Avito
   */
  async getStoryMessages(dto: AvitoMessagesGetStoryDto): Promise<AvitoStoryMessagesResponse> {
    try {
      const avitoApi = await this.getAvitoApi(dto.userId);
      return avitoApi.getChatMessages(dto);
    } catch (error) {
      this.loki.error('Ошибка ', { error: error.stack });
      throw error;
    }
  }
}
