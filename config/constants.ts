export const CACHING_EXP = {
  BACKEND: {
    AMO_ACCOUNT_DATA: {
      key: (id: number) => `amo_account:${id}`,
      ttl: 60 * 60 * 24 * 7,
    },
    ACCOUNT_DATA: {
      key: (id: number) => `account:${id}`,
      ttl: 60 * 60 * 24 * 7,
    },

    AVITO_XAUTH_TOKEN: {
      key: (subdomain: string) => `X-Auth-Token_${subdomain}`,
      ttl: 59 * 60,
    },
  },
};

export const AI_TOOLS = {
  INTEGRATIONS: {
    AMOCRM: 'amocrm',
    AVITO: 'avito',
  } as const,
};
