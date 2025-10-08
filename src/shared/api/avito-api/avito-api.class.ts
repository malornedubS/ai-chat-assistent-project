import axios, { AxiosInstance } from 'axios';
import * as FormData from 'form-data';
import { lookup } from 'mime-types';
import { AvitoApiInterceptor } from './avito-api.interceptor';
import * as qs from 'qs';
import {
  AvitoImageMessageResponse,
  AvitoImageUploadResponse,
  AvitoMessageRequest,
  AvitoSendMessageParams,
  MessageTypes,
  AvitoMessageResponse,
} from './types/avito-message-types';
import { LokiLogger } from 'gnzs-platform-modules';
import { AvitoMessagesGetStoryDto } from 'src/modules/integrations/avito/dto/avito-messages-get-story.dto';

export default class AvitoApi {
  private api: AxiosInstance;
  private logger: LokiLogger;
  private token: string;

  constructor(token: string, logger: LokiLogger) {
    this.logger = logger;
    this.token = token;
    this.api = this.createAxios();
  }

  /**
   * Отправить сообщение в чат
   */
  public async sendMessage(
    params: AvitoSendMessageParams,
  ): Promise<AvitoMessageResponse> {
    const payload: AvitoMessageRequest = {
      type: MessageTypes.text,
      message: {
        text: params.text,
      },
    };
    return this.api
      .post(
        `/messenger/v1/accounts/${params.userId}/chats/${params.chatId}/messages`,
        payload,
      )
      .then((resp) => resp?.data);
  }
  /**
   * Отправить изображение в чат
   */
  public async sendImageMessage(
    params: AvitoSendMessageParams,
  ): Promise<AvitoImageMessageResponse> {
    const payload = {
      image_id: params.imageId,
    };

    return this.api
      .post(
        `/messenger/v1/accounts/${params.userId}/chats/${params.chatId}/messages/image`,
        payload,
      )
      .then((resp) => resp.data);
  }

  /**
   * Загрузка изображения на сервер Avito
   */
  public async uploadImage(
    userId: number,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<AvitoImageUploadResponse> {
    const formData = new FormData();
    const contentType = lookup(filename) || 'application/octet-stream'; // или лучше сделать утилиту с разрешениями?
    formData.append('uploadfile[]', imageBuffer, { filename, contentType });

    return this.api
      .post(`/messenger/v1/accounts/${userId}/uploadImages`, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      })
      .then((resp) => resp?.data);
  }

  /**
   * Получить историю сообщений в чате
   */
  public async getChatMessages(dto: AvitoMessagesGetStoryDto) {
    return this.api
      .get(
        `/messenger/v3/accounts/${dto.userId}/chats/${dto.chatId}/messages`,
        {
          params: { limit: dto.limit, offset: dto.offset },
        },
      )
      .then((resp) => resp?.data);
  }

  public static async getAccessToken(): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    console.log('Запрос токена Avito');

    const data = {
      grant_type: 'client_credentials',
      client_id: process.env.AVITO_CLIENT_ID,
      client_secret: process.env.AVITO_CLIENT_SECRET,
    };

    const { access_token, expires_in } = (
      await axios.post(process.env.AVITO_AUTH_URL, qs.stringify(data), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    ).data;

    return { accessToken: access_token, expiresIn: expires_in };
  }

  protected createAxios(): AxiosInstance {
    const result = axios.create({
      baseURL: process.env.AVITO_API_URL,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (this.logger) {
      const req = AvitoApiInterceptor.request(this.logger);
      const resp = AvitoApiInterceptor.response(this.logger);
      result.interceptors.request.use(req.onFulfilled, req.onRejected);
      result.interceptors.response.use(resp.onFulfilled, resp.onRejected);
    }

    return result;
  }
}
