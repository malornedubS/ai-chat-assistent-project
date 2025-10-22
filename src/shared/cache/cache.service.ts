import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHING_EXP } from 'config/constants';
import { AmoAccountEntity } from 'src/modules/amo-accounts/entities/amo-account.entity';
import { AccountEntity } from 'src/modules/accounts/entities/account.entity';
import { AvitoAccountsEntity } from 'src/modules/integrations/avito/entities/avito-accounts.entity';

@Injectable()
export class GnzsCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public readonly account = {
    set: async (id: number, accountData: AccountEntity) => {
      const { key, ttl } = CACHING_EXP.BACKEND.ACCOUNT_DATA;
      await this.cacheManager.set(key(id), accountData, ttl);
    },

    get: async (id: number): Promise<AccountEntity> => {
      const { key } = CACHING_EXP.BACKEND.ACCOUNT_DATA;
      return await this.cacheManager.get(key(id));
    },

    del: async (id: number) => {
      const { key } = CACHING_EXP.BACKEND.ACCOUNT_DATA;
      await this.cacheManager.del(key(id));
    },
  };

  public readonly amoAccount = {
    set: async (id: number, accountData: AmoAccountEntity) => {
      const { key, ttl } = CACHING_EXP.BACKEND.AMO_ACCOUNT_DATA;
      await this.cacheManager.set(key(id), accountData, ttl);
    },

    get: async (id: number): Promise<AmoAccountEntity> => {
      const { key } = CACHING_EXP.BACKEND.AMO_ACCOUNT_DATA;
      return await this.cacheManager.get(key(id));
    },

    del: async (id: number) => {
      const { key } = CACHING_EXP.BACKEND.AMO_ACCOUNT_DATA;
      await this.cacheManager.del(key(id));
    },
  };
  public readonly avitoAccount = {
    set: async (id: number, accountData: AvitoAccountsEntity) => {
      const { key, ttl } = CACHING_EXP.BACKEND.AVITO_ACCOUNT_DATA;
      await this.cacheManager.set(key(id), accountData, ttl);
    },

    get: async (id: number): Promise<AvitoAccountsEntity> => {
      const { key } = CACHING_EXP.BACKEND.AVITO_ACCOUNT_DATA;
      return await this.cacheManager.get(key(id));
    },

    del: async (id: number) => {
      const { key } = CACHING_EXP.BACKEND.AVITO_ACCOUNT_DATA;
      await this.cacheManager.del(key(id));
    },
  };

  public readonly authToken = {
    set: async (subdomain: string | number, token: string) => {
      const { key, ttl } = CACHING_EXP.BACKEND.AVITO_XAUTH_TOKEN;
      await this.cacheManager.set(key(subdomain.toString()), token, ttl);
    },

    get: async (subdomain: string | number) => {
      const { key } = CACHING_EXP.BACKEND.AVITO_XAUTH_TOKEN;
      const cached = await this.cacheManager.get<string>(key(subdomain.toString()));
      return cached;
    },

    del: async (subdomain: string | number) => {
      const { key } = CACHING_EXP.BACKEND.AVITO_XAUTH_TOKEN;
      await this.cacheManager.del(key(subdomain.toString()));
    },
  };
}
