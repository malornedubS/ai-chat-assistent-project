import { LoggerService } from '@nestjs/common';
import { AvitoTokensService } from './avito-token.service';
import AvitoApi from 'src/shared/api/avito-api/avito-api.class';

export class AvitoAuthService {
  constructor(
    private tokenService: AvitoTokensService,
    private logger: LoggerService,
  ) {}

  public getAuthUrl(accountId: number): string {
    const clientId = process.env.AVITO_CLIENT_ID;
    const redirectUri = process.env.AVITO_REDIRECT_URL;
    const scope = 'messenger:read,messenger:write';
    const state = `${accountId}-${Date.now()}`;

    const authUrl = `https://avito.ru/oauth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&state=${state}`;
    this.logger.log(
      `Сгенерированный URL-адрес авторизации Avito для аккаунта ${accountId}: ${authUrl}`,
    );
    return authUrl;
  }

  public async exchangeCode(accountId: number, code: string) {
    // 1. Обмен кода на токены
    const tokens = await AvitoApi.getAccessTokenByCode(code);

    // 2. Сохраняем токены через TokenService
    await this.tokenService.saveTokens(accountId, tokens);

    this.logger.log(
      `Первичные токены Avito сохранены для аккаунта ${accountId}`,
    );
  }
}
