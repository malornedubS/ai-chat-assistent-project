import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const configuration = () => {
  const MODE = process.env.MODE.toUpperCase();

  return {
    dbPlatform: {
      type: 'postgres',
      host: process.env[`DB_PLATFORM_HOST_${MODE}`],
      port: parseInt(process.env[`DB_PLATFORM_PORT_${MODE}`]),
      username: process.env[`DB_PLATFORM_USER_${MODE}`],
      password: process.env[`DB_PLATFORM_PASSWORD_${MODE}`],
      database: process.env[`DB_PLATFORM_NAME_${MODE}`],
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      logging: +process.env[`DB_LOG_QUERY_${MODE}`] == 1,
      synchronize: false,
    },
    redis: {
      url: process.env.REDIS_URL,
    },
    loki: {
      lokiUrl: 'http://172.17.0.1:3100', // loki server
      labels: {
        container_name: 'core-api-nodejs', // значения по умолчанию, чтобы логи подтягивались в контейнер.
      },
      logToConsole: process.env.MODE == 'dev',
      discordWebhook: `https://discord.com/api/webhooks/****`, // адрес хука для отправки данных в дискорд.
    },
  };
};
