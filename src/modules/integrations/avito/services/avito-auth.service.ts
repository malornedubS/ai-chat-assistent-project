import { Injectable } from '@nestjs/common';
import { AvitoTokensService } from './avito-token.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { LokiLogger } from 'gnzs-platform-modules';
import { AvitoAccountsService } from './avito-account.service';
@Injectable()
export class AvitoAuthService {
  constructor(
    private tokenService: AvitoTokensService,
    private avitoAccountService: AvitoAccountsService,
    private readonly loki: LokiLogger,
  ) {
    this.loki.setContextName(AvitoAuthService.name);
  }

  public getAuthUrl(accountId: number): string {
    const clientId = process.env.AVITO_CLIENT_ID;
    const redirectUri = process.env.AVITO_REDIRECT_URL;
    const scope = 'messenger:read,messenger:write,user:read';
    const state = `${accountId}-${Date.now()}`;

    const authUrl = `https://avito.ru/oauth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&state=${state}`;
    this.loki.log(
      `Сгенерированный URL-адрес авторизации Avito для аккаунта ${accountId}: ${authUrl}`,
    );
    return authUrl;
  }

  public async exchangeCode(accountId: number, code: string) {
    // 1. Получаем токены
    const tokens = await AvitoApi.getAccessTokenByCode(code);

    // 2. Получаем данные пользователя
    const userInfo = await AvitoApi.getUserInfo(tokens.accessToken);
    console.log('Данные пользователя:', userInfo);

    // 3. Сохраняем данные пользователя
    await this.avitoAccountService.create(userInfo, accountId);

    this.loki.log(`Avito подключен к пользователю: ${userInfo.name}`);

    // 4. Сохраняем токены
    await this.tokenService.saveToken(userInfo.id, tokens);

    //5. Регистрируем вебхук
    await AvitoApi.registerWebhook(tokens.accessToken);
  }
}
