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
  public async sendMessage(params: AvitoSendMessageParams): Promise<AvitoMessageResponse> {
    const payload: AvitoMessageRequest = {
      type: MessageTypes.text,
      message: {
        text: params.text,
      },
    };
    return this.api.post(`/messenger/v1/accounts/${params.userId}/chats/${params.chatId}/messages`, payload).then((resp) => resp?.data);
  }
  /**
   * Отправить изображение в чат
   */
  public async sendImageMessage(params: AvitoSendMessageParams): Promise<AvitoImageMessageResponse> {
    const payload = {
      image_id: params.imageId,
    };

    return this.api.post(`/messenger/v1/accounts/${params.userId}/chats/${params.chatId}/messages/image`, payload).then((resp) => resp.data);
  }

  /**
   * Загрузка изображения на сервер Avito
   */
  public async uploadImage(userId: number, imageBuffer: Buffer, filename: string): Promise<AvitoImageUploadResponse> {
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
      .get(`/messenger/v3/accounts/${dto.userId}/chats/${dto.chatId}/messages`, {
        params: { limit: dto.limit, offset: dto.offset },
      })
      .then((resp) => resp?.data);
  }
  /**
   * Инофрмация о пользователе
   */
  public async getUserInfo(): Promise<any> {
    const response = await axios.get(`${process.env.AVITO_API_URL}/core/v1/accounts/self`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  /**
   * Обмен authorization_code на accessToken и refreshToken
   */
  public static async getAccessTokenByCode(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const data = {
      grant_type: 'authorization_code',
      code,
      client_id: process.env.AVITO_CLIENT_ID,
      client_secret: process.env.AVITO_CLIENT_SECRET,
      redirect_uri: process.env.AVITO_REDIRECT_URL,
    };

    const { access_token, refresh_token, expires_in } = (
      await axios.post(process.env.AVITO_AUTH_URL, qs.stringify(data), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    ).data;

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    };
  }

  /**
   * Обновление accessToken через refreshToken
   */
  public static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const data = {
      grant_type: 'refresh_token',
      client_id: process.env.AVITO_CLIENT_ID,
      client_secret: process.env.AVITO_CLIENT_SECRET,
      refresh_token: refreshToken,
    };

    const { access_token, refresh_token, expires_in } = (
      await axios.post(process.env.AVITO_AUTH_URL, qs.stringify(data), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    ).data;

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in,
    };
  }

  /**
   * Зарегистрировать URL для получения вебхуков
   */
  public static async registerWebhook(accessToken: string): Promise<void> {
    const webhookUrl = process.env.AVITO_WEBHOOK_URL;

    const response = await axios.post(
      `${process.env.AVITO_API_URL}/messenger/v3/webhook`,
      { url: webhookUrl },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  }

  /**
   * Генерация URL для авторизации Avito
   */
  public static getAuthUrl(accountId: number): string {
    const clientId = process.env.AVITO_CLIENT_ID;
    const redirectUri = process.env.AVITO_REDIRECT_URL;
    const scope = 'messenger:read,messenger:write,user:read';
    const state = `${accountId}-${Date.now()}`;

    return `https://avito.ru/oauth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&state=${state}`;
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
