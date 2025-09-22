import { APP_NAME } from 'src/shared/constants/app.constants';
import { serializedError } from 'src/shared/utils/app.utils';
import { LokiLogger } from 'gnzs-platform-modules';
import { Logger } from 'typeorm';

export class TypeOrmLogger implements Logger {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  logQuery(query: string, parameters?: any[]) {
    //console.log(`QUERY: ${query}, --PARAMETERS: ${parameters?.join('')}`);
  }

  async logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
  ) {
    console.log(
      `QUERY FAILED: ${query}, --PARAMETERS: ${parameters?.join(
        '',
      )}, ERROR: ${error}`,
    );

    try {
      await LokiLogger.sendTgNotify(
        `[${APP_NAME}]: Query failed: ${query.slice(0, 100)}`,
      );
    } catch (e) {
      console.log('Ошибка логирования', serializedError(e));
    }
  }

  logSchemaBuild(message: string) {
    console.log(message);
  }

  logMigration(message: string) {
    console.log(message);
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  log(message: string) {
    //console.log(message);
  }

  async logQuerySlow(time: number, query: string, parameters?: any[]) {
    console.log(
      `SLOW QUERY: ${query}, TIME: ${time}ms, --PARAMETERS: ${parameters?.join(
        '',
      )}`,
    );

    try {
      await LokiLogger.sendTgNotify(
        `[${APP_NAME}]: Slow query detected: ${query.slice(
          0,
          100,
        )}, Time: ${time}ms`,
      );
    } catch (e) {
      console.log('Ошибка логирования', serializedError(e));
    }
  }
}
