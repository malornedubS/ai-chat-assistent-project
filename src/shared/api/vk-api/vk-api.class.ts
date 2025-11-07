import axios, { AxiosInstance } from 'axios';
import * as qs from 'qs';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { LokiLogger } from 'gnzs-platform-modules';
import { VkApiInterceptor } from './vk-api.interceptor';
import { VkAuthCodeResponse, VkSendMessageParams, VkSendMessageResponse } from './types/vk-types';

export default class VkApi {
  private api: AxiosInstance;
  private logger: LokiLogger;
  private token: string;

  constructor(token: string, logger: LokiLogger) {
    this.logger = logger;
    this.token = token;
    this.api = this.createAxios();
  }

  /**
   * Получение информации о пользователе VK
   */
  public async getUserInfo(): Promise<any> {
    const response = await this.api.get('users.get', {
      params: {
        fields: 'first_name,last_name',
        v: '5.199',
      },
    });
    return response.data;
  }

  /**
   * Отправка сообщения пользователю или в чат
   */
  public async sendMessage(params: VkSendMessageParams): Promise<VkSendMessageResponse> {
    const payload = {
      peer_id: params.peerId,
      random_id: Math.floor(Math.random() * 2147483647),
      message: params.message,
      attachment: params.attachment,
      access_token: this.token,
      v: '5.199',
    };
    if (params.message?.trim()) {
      payload.message = params.message.trim();
    }

    // Добавляем attachment только если есть
    if (params.attachment) {
      payload.attachment = params.attachment;
    }
    return await this.api
      .post('messages.send', null, {
        params: payload,
      })
      .then((resp) => resp?.data);
  }

  /**
   * Загрузка изображения на сервер VK
   */
  public async getMessagesUploadServer(peerId: number) {
    return this.api
      .get('photos.getMessagesUploadServer', {
        params: { peer_id: peerId, v: '5.199', access_token: this.token },
      })
      .then((r) => r.data.response);
  }

  /**
   * Сохранение изображения на сервере VK
   */
  public async saveMessagesPhoto(server: number, photo: string, hash: string) {
    return this.api
      .get('photos.saveMessagesPhoto', {
        params: { server, photo, hash, v: '5.199', access_token: this.token },
      })
      .then((r) => r.data.response);
  }

  /**
   * Загрузка файла на сервер VK
   */
  public async uploadFileToServer(uploadUrl: string, filePath: string) {
    const formData = new FormData();
    formData.append('photo', fs.createReadStream(filePath));
    return await this.api
      .post(uploadUrl, formData, {
        headers: formData.getHeaders(),
        timeout: 30000,
      })
      .then((r) => r.data.response);
  }

  /**
   * Загрузка файла на сервер VK
   */
  public async uploadFileFromBuffer(uploadUrl: string, buffer: Buffer, filename: string) {
    const formData = new FormData();
    formData.append('photo', buffer, {
      filename,
      contentType: 'image/jpeg',
    });

    const { data } = await this.api.post(uploadUrl, formData, {
      headers: formData.getHeaders(),
    });

    return data;
  }

  /**
   * Получение списка сообществ (групп), в которых состоит пользователь
   */
  public async getUserGroups(): Promise<any> {
    const params = {
      extended: 1,
      filter: 'admin,editor',
      v: '5.199',
    };

    return await this.api.get('groups.get', { params }).then((resp) => resp?.data);
  }

  /**
   * Генерация URL для авторизации VK
   */
  public static getAuthUrl(accountId: number, codeChallenge: string, state: string): string {
    const clientId = process.env.VK_CLIENT_ID;
    const redirectUri = process.env.VK_REDIRECT_URI;
    const scope = 'messages,photos,docs,audio,audio_message,offline';

    return `https://id.vk.ru/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  }

  /**
   * Генерация URL для подключения группы VK
   */
  public static getGroupAuthUrl(groupId: number): string {
    const clientId = process.env.VK_CLIENT_ID;
    const redirectUri = process.env.VK_GROUP_REDIRECT_URI;
    const scope = 'messages,photos,docs,audio,audio_message';
    const apiVersion = '5.199';

    const url = `https://oauth.vk.ru/authorize?client_id=${clientId}&display=page&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&group_ids=${groupId}&scope=${scope}&response_type=code&v=${apiVersion}`;

    return url;
  }
  /**
   * Обновление accessToken через refreshToken
   */
  public static async refreshAccessToken(
    refreshToken: string,
    deviceId: string,
    state: string,
  ): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user_id: number;
    state: string;
  }> {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.VK_CLIENT_ID,
      device_id: deviceId,
      state,
    };

    const response = await axios.post('https://id.vk.ru/oauth2/auth', qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const res = response.data;

    return {
      access_token: res.access_token,
      refresh_token: res.refresh_token,
      expires_in: res.expires_in,
      user_id: res.user_id,
      state: res.state,
    };
  }

  /**
   * Обмен authorization_code на access_token
   */
  public static async getAccessTokenByCode(code: string, codeVerifier: string, deviceId: string): Promise<VkAuthCodeResponse> {
    const data = {
      client_id: process.env.VK_CLIENT_ID,
      client_secret: process.env.VK_CLIENT_SECRET,
      code: code,
      code_verifier: codeVerifier,
      device_id: deviceId,
      grant_type: 'authorization_code',
      redirect_uri: process.env.VK_REDIRECT_URI,
    };

    const response = await axios.post('https://id.vk.ru/oauth2/auth', qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log(' Получены токены:', response.data);
    return response.data;
  }

  /**
   * Обмен authorization_code на access_token сообщества
   */
  public static async getGroupAccessToken(code: string): Promise<{
    expires_in: number;
    groups: Array<{
      group_id: number;
      access_token: string;
    }>;
  }> {
    const clientId = process.env.VK_CLIENT_ID;
    const clientSecret = process.env.VK_CLIENT_SECRET;
    const redirectUri = process.env.VK_GROUP_REDIRECT_URI;

    const url = `https://oauth.vk.ru/access_token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&code=${code}`;

    const response = await axios.get(url);

    if (response.data.error) {
      throw new Error(`VK OAuth error: ${JSON.stringify(response.data.error)}`);
    }

    return response.data;
  }

  protected createAxios(): AxiosInstance {
    const result = axios.create({
      baseURL: process.env.VK_API_URL,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (this.logger) {
      const req = VkApiInterceptor.request(this.logger);
      const resp = VkApiInterceptor.response(this.logger);
      result.interceptors.request.use(req.onFulfilled, req.onRejected);
      result.interceptors.response.use(resp.onFulfilled, resp.onRejected);
    }

    return result;
  }
}
