import { Injectable } from '@nestjs/common';
import VkApi from 'src/shared/api/vk-api/vk-api.class';
import { LokiLogger } from 'gnzs-platform-modules';
import * as utils from '../utils/vk-utils';
import { VkTokensService } from './vk-tokens.service';
import { VkAccountsService } from './vk-accounts.servie';

@Injectable()
export class VkAuthService {
  constructor(
    private readonly loki: LokiLogger,
    private readonly vkAccountsService: VkAccountsService,
    private readonly vkTokensService: VkTokensService,
  ) {
    this.loki.setContextName(VkAuthService.name);
  }

  /**
   * Генерация URL для авторизации VK
   */
  getAuthUrl(accountId: number) {
    const { codeVerifier, codeChallenge } = utils.generatePkceParams();

    const state = utils.encodeVkState({
      accountId,
      codeVerifier,
      timestamp: Date.now(),
    });

    const authUrl = VkApi.getAuthUrl(accountId, codeChallenge, state);

    return {
      authUrl,
      state,
    };
  }

  /**
   * Генерация URL для авторизации группы VK
   */
  getGroupAuthUrl(vkUserId: number, vkGroupId: number) {
    const state = utils.encodeVkState({
      vkUserId,
      vkGroupId,
      timestamp: Date.now(),
    });

    const url = VkApi.getGroupAuthUrl(vkGroupId) + `&state=${state}`;
    return url;
  }

  /**
   * Обмен кода на токены и сохранение данных
   */
  public async exchangeUserCode(code: string, state: string, deviceId: string) {
    try {
      const stateData = utils.decodeVkState<{ accountId: number; codeVerifier: string }>(state);
      const { accountId, codeVerifier } = stateData;

      const tokens = await VkApi.getAccessTokenByCode(code, codeVerifier, deviceId);

      const vkApi = new VkApi(tokens.access_token, this.loki);
      const userInfoResponse = await vkApi.getUserInfo();
      console.log(userInfoResponse);
      const userInfo = userInfoResponse.response[0];

      const vkUserDto = utils.buildVkUserDto(userInfo);
      const vkUser = await this.vkAccountsService.create(vkUserDto, accountId);

      await this.vkTokensService.saveUserTokens(
        tokens.user_id,
        tokens.access_token,
        tokens.refresh_token,
        tokens.id_token,
        deviceId,
        tokens.expires_in,
      );

      await this.vkTokensService.updateState(tokens.user_id, state);

      this.loki.log(`Успешная авторизация VK для пользователя: ${vkUser.fullName}`);

      return {
        user: vkUser,
        tokens,
      };
    } catch (error) {
      this.loki.error('Ошибка при обмене кода VK на токены:', error);
      throw new Error(`Ошибка авторизации VK: ${error.message}`);
    }
  }

  /**
   * Обмен кода на токены группы
   */
  public async exchangeGroupCode(code: string, state: string) {
    const { vkUserId, vkGroupId } = utils.decodeVkState<{ vkUserId: number; vkGroupId: number }>(state);

    const data = await VkApi.getGroupAccessToken(code);
    const g = data.groups[0];

    await this.vkTokensService.saveGroupToken(vkUserId, g.group_id, g.access_token);

    return { vkGroupId };
  }
}
