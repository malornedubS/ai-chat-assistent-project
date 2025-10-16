import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { LokiLogger } from 'gnzs-platform-modules';
import { APP_NAME } from 'src/shared/constants/app.constants';
import { HttpExceptionFilter } from './shared/filters/http-exception-filter';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const config: NestApplicationOptions = {
    cors: {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
    bufferLogs: true,
  };

  const app = await NestFactory.create(AppModule, config);

  // app.use(helmet());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // глобально добавляем валидацию https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe

  // Here wer can connect static
  //app.use('/terms', express.static('./dist/public/terms.html'))

  // // авторизация для документации
  // if (process.env.MODE != 'dev') {
  //   app.use(
  //     ['/docs', '/docs-json'],
  //     basicAuth({
  //       challenge: true,
  //       users: {
  //         [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
  //       },
  //     }),
  //   );
  // }

  const configSwagger = new DocumentBuilder()
    .setTitle('Your awesome API')
    .setDescription('Описание API')
    .setVersion('1.0')
    .build();

  const documentSwagger = SwaggerModule.createDocument(app, configSwagger);

  const optionsSwagger: SwaggerCustomOptions = {
    swaggerOptions: {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'My API Docs',
    },
  };

  SwaggerModule.setup('docs', app, documentSwagger, optionsSwagger);

  await LokiLogger.sendTgNotify(`[${APP_NAME}]: start nestjs application`);

  process.on('unhandledRejection', async (err) => {
    await LokiLogger.sendTgNotify(`[${APP_NAME}]: unhandledRejection ${err}`);
  });

  await app.listen(3000);
}
bootstrap();
