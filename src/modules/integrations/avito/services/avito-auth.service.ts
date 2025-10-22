import { Injectable } from '@nestjs/common';
import { AvitoTokensService } from './avito-token.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';
import { LokiLogger } from 'gnzs-platform-modules';
import { AvitoAccountsService } from './avito-account.service';
@Injectable()
export class AvitoAuthService {
  constructor(private tokenService: AvitoTokensService, private avitoAccountService: AvitoAccountsService, private readonly loki: LokiLogger) {
    this.loki.setContextName(AvitoAuthService.name);
  }

  getAuthUrl(accountId: number): string {
    const url = AvitoApi.getAuthUrl(accountId);
    this.loki.log(`Сгенерированный URL авторизации Avito: ${url}`);
    return url;
  }

  public async exchangeCode(accountId: number, code: string) {
    const tokens = await AvitoApi.getAccessTokenByCode(code);

    const avitoApi = new AvitoApi(tokens.accessToken, this.loki);

    const userInfo = await avitoApi.getUserInfo();
    console.log('Данные пользователя:', userInfo);

    await this.avitoAccountService.create(userInfo, accountId);
    this.loki.log(`Avito подключен к пользователю: ${userInfo.name}`);

    await this.tokenService.saveToken(userInfo.id, tokens.accessToken, tokens.refreshToken, tokens.expiresIn);

    await AvitoApi.registerWebhook(tokens.accessToken);
  }
}
