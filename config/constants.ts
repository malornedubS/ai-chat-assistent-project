export const CACHING_EXP = {
  BACKEND: {
    ACCOUNT_DATA: {
      key: (id: number) => `account:${id}`,
      ttl: 60 * 60 * 24 * 7,
    },

    AMO_ACCOUNT_DATA: {
      key: (id: number) => `amo_account:${id}`,
      ttl: 60 * 60 * 24 * 7,
    },

    AVITO_ACCOUNT_DATA: {
      key: (id: number) => `avito_account:${id}`,
      ttl: 60 * 60 * 24 * 7,
    },

    VK_ACCOUNT_DATA: {
      key: (id: number) => `vk_account:${id}`,
      ttl: 60 * 60 * 24 * 7,
    },

    VK_AUTH_TOKEN: {
      key: (vkUserId: string) => `vk:auth:token:${vkUserId}`,
      ttl: 60 * 50,
    },

    AVITO_XAUTH_TOKEN: {
      key: (subdomain: string) => `X-Auth-Token_${subdomain}`,
      ttl: 59 * 60,
    },
  },
};

export const MyCronExpressions = {
  EVERY_6_HOURS: '0 0 */6 * * *',
  EVERY_50_MINUTES: '0 */50 * * * *',
  EVERY_5_SECONDS: '*/5 * * * * *',
};

export const AI_TOOLS = {
  INTEGRATIONS: {
    AMOCRM: 'amocrm',
    AVITO: 'avito',
  } as const,
};
