import { HttpException } from '@nestjs/common';
import { LokiLogger } from 'gnzs-platform-modules';

export const AvitoApiInterceptor = {
  request: (logger: LokiLogger) => {
    return {
      onFulfilled: (req) => {
        logger.logRequest(
          req.baseURL + req.url,
          req.method,
          {
            headers: req.headers,
            params: req.params,
            data: req.data,
          },
          'REQUEST TO AVITO API',
        );
        return req;
      },

      onRejected: (error) => {
        logger.error('REQUEST TO AVITO API', { errorData: error });
        return Promise.reject(error);
      },
    };
  },

  response: (logger: LokiLogger) => {
    return {
      onFulfilled: (resp) => {
        const { status, statusText, headers, data } = resp;
        const { baseURL, url, method } = resp.config;
        logger.logResponse(
          baseURL + url,
          method,
          status,
          { data, statusText, headers },
          'RESPONSE FROM AVITO API',
        );

        if (status == 204) {
          throw new HttpException('no content', status);
        }
        return resp;
      },

      onRejected: (error) => {
        if (!error?.response) {
          return Promise.reject(error);
        }

        const { status, statusText, config, data } = error?.response;

        const errorMsg = `RESPONSE FROM AVITO API [${config?.method?.toUpperCase()}] ${
          config.baseURL + config.url
        } - ${status}: ${statusText} (${data?.detail || 'no detail'})`;

        if (status) {
          logger.error(errorMsg, {
            errorData: data,
            reqData: config?.data ? JSON.parse(config?.data) : '',
            reqParams: config?.params,
          });
        }

        throw new HttpException(data, status);
      },
    };
  },
};
