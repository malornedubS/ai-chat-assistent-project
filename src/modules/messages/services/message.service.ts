import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LokiLogger } from 'gnzs-platform-modules';
import { Repository } from 'typeorm';
import { Messages } from '../entity/messages.entity';
import { MessageCreateDto } from '../dto/message-create.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Messages) private messagesRepo: Repository<Messages>,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(MessageService.name);
  }
  /*Сохранение входящего сообщения в БД*/
  async saveIncomigMessage(messageData: MessageCreateDto): Promise<Messages> {
    this.loki.log('Сохраняем входящее сообщение в БД', messageData);
    try {
      const msg = this.messagesRepo.create(messageData);
      return await this.messagesRepo.save(msg);
    } catch (error) {
      this.loki.error('Ошибка при сохранении входящего сообщения в БД', error);
      throw error;
    }
  }
  /*Сохранение исходящего сообщения в БД*/
  async saveOutgoingMessage(messageData: MessageCreateDto): Promise<Messages> {
    this.loki.log('Сохраняем исходящее сообщение в БД', messageData);
    try {
      const msg = this.messagesRepo.create({
        ...messageData,
        role: 'assistant',
      });
      return await this.messagesRepo.save(msg);
    } catch (error) {
      this.loki.error('Ошибка при сохранении исходящего сообщения', error);
      throw error;
    }
  }

  /* Получить всю историю диалога */
  async getChatHistory(chatId: string): Promise<Messages[]> {
    try {
      return await this.messagesRepo.find({
        where: { chatId },
        order: { createdAt: 'ASC' },
      });
    } catch (err) {
      this.loki.error('Ошибка при получении всех сообщений', err);
      throw err;
    }
  }

  /* Получить N количество сообщений */
  async getManyMessages(chatId: string, limit = 50): Promise<Messages[]> {
    return await this.messagesRepo.find({
      where: { chatId },
      order: { createdAt: 'ASC' },
      take: limit,
    });
  }
}
