// vk-auth.service.ts
import { Injectable } from '@nestjs/common';
import VkApi from 'src/shared/api/vk-api/vk-api.class';
import { LokiLogger } from 'gnzs-platform-modules';
import * as utils from '../utils/vk-utils';
import { VkTokensService } from './vk-tokens.service';
import { VkService } from './vk.service';

import { VkAccountsService } from './vk-accounts.servie';

@Injectable()
export class VkAuthService {
  constructor(
    private readonly loki: LokiLogger,
    private readonly vkAccountsService: VkAccountsService,
    private readonly vkService: VkService,
    private readonly vkTokensService: VkTokensService,
  ) {
    this.loki.setContextName(VkAuthService.name);
  }

  /**
   * Генерация URL для авторизации VK
   */
  getAuthUrl(accountId: number) {
    const { codeVerifier, codeChallenge } = utils.generatePkceParams();

    const state = utils.VkStateUtil.encode({
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
    const state = utils.VkStateUtil.encode({
      vkUserId,
      vkGroupId,
      timestamp: Date.now(),
    });

    const url = VkApi.getGroupAuthUrl(vkGroupId) + `&state=${state}`;
    return { url };
  }

  /**
   * Обмен кода на токены и сохранение данных
   */
  public async exchangeUserCode(code: string, state: string, deviceId: string) {
    try {
      // Декодируем state
      const stateData = utils.VkStateUtil.decode<{ accountId: number; codeVerifier: string }>(state);
      const accountId = stateData.accountId;
      const codeVerifier = stateData.codeVerifier;

      const tokens = await VkApi.getAccessTokenByCode(code, codeVerifier, deviceId);
      const vkApi = new VkApi(tokens.access_token, this.loki);
      const userInfoResponse = await vkApi.getUserInfo();
      const userInfo = userInfoResponse.response[0];
      const vkUserDto = utils.VkUserUtils.createVkUserDto(userInfo);
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
        tokens: tokens,
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
    const { vkUserId, vkGroupId } = utils.VkStateUtil.decode<{ vkUserId: number; vkGroupId: number }>(state);
    const data = await VkApi.getGroupAccessToken(code);

    const g = data.groups[0];
    await this.vkTokensService.saveGroupToken(vkUserId, g.group_id, g.access_token);

    return { vkGroupId };
  }
}
