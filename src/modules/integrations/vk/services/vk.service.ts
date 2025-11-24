import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import VkApi from 'src/shared/api/vk-api/vk-api.class';
import { VkGroupsTokenEntity } from '../entities/vk-groups-tokens.entity';
import { VkSendMessageDto } from '../dto/vk-send-message.dto';

@Injectable()
export class VkService {
  constructor(
    @InjectRepository(VkGroupsTokenEntity)
    private readonly vkTokenGroupRepository: Repository<VkGroupsTokenEntity>,
    private readonly api: VkApi,
    private readonly loki: LokiLogger,
  ) {}

  /**
   * Отправить сообщение пользователю или в чат
   */
  async sendMessage(dto: VkSendMessageDto, file?: Express.Multer.File) {
    const { vkUserId, peerId, text } = dto;

    if (!text && !file) {
      throw new BadRequestException('Нужен либо text, либо file');
    }

    const vkApi = await this.getGroupVkApi(vkUserId);

    let attachment: string;

    if (file) {
      attachment = await this.uploadMedia(vkApi, peerId, file);
    }

    return vkApi.sendMessage({
      peerId,
      message: text,
      attachment,
    });
  }

  /**
   *  Свитчер для загрузки файлов
   */
  private async uploadMedia(vkApi: VkApi, peerId: number, file: Express.Multer.File): Promise<string> {
    if (file.mimetype.startsWith('image/')) {
      return await this.uploadPhoto(vkApi, peerId, file);
    }

    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/')) {
      return await this.uploadDocument(vkApi, peerId, file);
    }

    throw new BadRequestException('Неподдерживаемый тип файла');
  }

  /**
   * Загружает фото на сервер VK
   */
  private async uploadPhoto(vkApi: VkApi, peerId: number, file: Express.Multer.File): Promise<string> {
    const uploadServer = await vkApi.getPhotoMessagesUploadServer(peerId);
    const uploadResp = await vkApi.uploadFileBuffer(uploadServer.upload_url, file.buffer, file.originalname, 'photo');
    const savedPhotos = await vkApi.saveMessagesPhoto(uploadResp.server, uploadResp.photo, uploadResp.hash);

    if (!savedPhotos || savedPhotos.length === 0) {
      throw new Error(`Не удалось сохранить фото на сервере VK: ${JSON.stringify(uploadResp)}`);
    }

    const photo = savedPhotos[0];
    return `photo${photo.owner_id}_${photo.id}`;
  }

  /**
   * Загрузка документа на сервер VK
   */
  private async uploadDocument(vkApi: VkApi, peerId: number, file: Express.Multer.File): Promise<string> {
    const uploadServer = await vkApi.getDocsMessagesUploadServer(peerId);
    const uploadResp = await vkApi.uploadFileBuffer(uploadServer.upload_url, file.buffer, file.originalname, 'file');

    if (!uploadResp?.file) {
      throw new Error(`Ошибка загрузки документа VK: ${JSON.stringify(uploadResp)}`);
    }

    const saved = await vkApi.saveMessagesDoc(uploadResp.file);

    if (!saved?.doc) {
      throw new Error(`Ошибка сохранения документа VK: ${JSON.stringify(saved)}`);
    }
    const doc = saved.doc;
    return `doc${doc.owner_id}_${doc.id}`;
  }

  private async getGroupVkApi(vkUserId: number): Promise<VkApi> {
    const token = await this.vkTokenGroupRepository.findOne({
      where: { vkUserId: vkUserId },
    });

    if (!token) {
      throw new NotFoundException(`Групповой токен не найден для пользователя VK ${vkUserId}`);
    }

    return new VkApi(token.accessToken, this.loki);
  }
}
