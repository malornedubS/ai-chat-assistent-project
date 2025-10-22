import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { serializedError } from 'src/shared/utils/app.utils';
import { LokiLogger } from 'gnzs-platform-modules';
import { APP_NAME } from 'src/shared/constants/app.constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.getResponse(),
      });
    }

    const error = serializedError(exception);
    console.log('Необработанная ошибка:', { e: error });

    try {
      await LokiLogger.sendTgNotify(`[${APP_NAME}]: Необработанная ошибка "${error?.message ?? ''}"`);
    } catch (e) {
      console.log('Ошибка отправки сообщения', { e: error?.message ?? '' });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
