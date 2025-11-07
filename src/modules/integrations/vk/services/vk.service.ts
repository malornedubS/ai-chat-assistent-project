import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as utils from '../utils/vk-utils';
import VkApi from 'src/shared/api/vk-api/vk-api.class';
import { VkTokensService } from './vk-tokens.service';
import { VkGroupsTokenEntity } from '../entities/vk-groups-tokens';
import { VkSendMessageDto } from '../dto/vk-send-message.dto';

@Injectable()
export class VkService {
  constructor(
    @InjectRepository(VkGroupsTokenEntity)
    private readonly vkTokenGroupRepository: Repository<VkGroupsTokenEntity>,
    private readonly api: VkApi,
    private readonly tokensService: VkTokensService,
    private readonly loki: LokiLogger,
  ) {}

  /**
   * Отправить сообщение пользователю или в чат
   */
  async sendMessage(dto: VkSendMessageDto, file?: Express.Multer.File) {
    const { vkUserId, peerId, text, attachments } = dto;

    if (!text && !file && (!attachments || attachments.length === 0)) {
      throw new BadRequestException('Нужно указать text или attachments');
    }

    const vkApi = await this.getGroupVkApi(vkUserId);

    let attachmentString: string | undefined = undefined;
    if (file) {
      attachmentString = await this.uploadPhotoAndGetAttachment(vkApi, peerId, file);
    } else if (attachments && attachments.length > 0) {
      attachmentString = utils.serializeAttachments(attachments);
    }

    return vkApi.sendMessage({
      peerId,
      message: text?.trim() || '',
      attachment: attachmentString,
    });
  }

  /**
   * Загружает фото на сервер VK и возвращает attachment для сообщений
   */
  private async uploadPhotoAndGetAttachment(vkApi: VkApi, peerId: number, file: Express.Multer.File): Promise<string> {
    const uploadServer = await vkApi.getMessagesUploadServer(peerId);

    const uploadResp = await vkApi.uploadFileFromBuffer(uploadServer.upload_url, file.buffer, file.originalname);

    const savedPhotos = await vkApi.saveMessagesPhoto(uploadResp.server, uploadResp.photo, uploadResp.hash);

    if (!savedPhotos || savedPhotos.length === 0) {
      throw new Error(`Не удалось сохранить фото на сервере VK: ${JSON.stringify(uploadResp)}`);
    }

    const photo = savedPhotos[0];
    return `photo${photo.owner_id}_${photo.id}`;
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
