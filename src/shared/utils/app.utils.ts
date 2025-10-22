import { PAYMENT_URL } from 'src/shared/constants/app.constants';

export const wait = (time: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(time), time));
};

export const getTimeByDays = (days: number) => {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

/**
 * Выбор склонения слова в зависимости от числа.
 * @param digit
 * @param words
 * @returns
 */
export const numeralWord = (digit: number, words: string[]) => {
  digit = Math.abs(digit) % 100;
  const num = digit % 10;
  if (digit > 10 && digit < 20) return words[2];
  if (num > 1 && num < 5) return words[1];
  if (num == 1) return words[0];
  return words[2];
};

/**
 * валидация телефона, который приходит с фронтенда при установке виджета
 * @param phone
 * @param lang
 * @returns
 */
export const getPhoneValidError = (phone: string, lang: LanguageType = 'ru') => {
  const phoneDigits = String(phone).replace(/[^\d;]/g, '');
  let errorText = '';
  const invalids = [
    '00000000',
    '111111111',
    '22222222',
    '33333333',
    '44444444',
    '55555555',
    '66666666',
    '77777777',
    '88888888',
    '99999999',
    '1234567',
    '98765432',
  ];

  if (phoneDigits.length < 11 || invalids.some((inv) => phoneDigits.includes(inv))) {
    errorText = LOCALE[lang].PHONE_NOT_VALID();
  }

  return errorText;
};

export const getOauth2ReGrantAccess = (topLevelDomain: string, integrationId: string): string => {
  if (!topLevelDomain?.length) topLevelDomain = 'ru';
  return `https://www.amocrm.${topLevelDomain}/oauth?client_id=${integrationId}`;
};

export const contactUsHtml_ru = () => {
  return `<div class="gnzs-description-widget__messangers-container"> <div class="gnzs-description-widget__messangers-container-title"> Есть вопросы? Напишите нам=) </div><a class="gnzs-description-widget__contact-elem" href="https://vk.me/-148384693?ref=amo_leadcopier&ref_source=amo_market" target="_blank" > <svg title="Вконтакте" viewBox="0 0 576 512" class="gnzs-description-widget__icon" > <path fill="currentColor" d="M545 117.7c3.7-12.5 0-21.7-17.8-21.7h-58.9c-15 0-21.9 7.9-25.6 16.7 0 0-30 73.1-72.4 120.5-13.7 13.7-20 18.1-27.5 18.1-3.7 0-9.4-4.4-9.4-16.9V117.7c0-15-4.2-21.7-16.6-21.7h-92.6c-9.4 0-15 7-15 13.5 0 14.2 21.2 17.5 23.4 57.5v86.8c0 19-3.4 22.5-10.9 22.5-20 0-68.6-73.4-97.4-157.4-5.8-16.3-11.5-22.9-26.6-22.9H38.8c-16.8 0-20.2 7.9-20.2 16.7 0 15.6 20 93.1 93.1 195.5C160.4 378.1 229 416 291.4 416c37.5 0 42.1-8.4 42.1-22.9 0-66.8-3.4-73.1 15.4-73.1 8.7 0 23.7 4.4 58.7 38.1 40 40 46.6 57.9 69 57.9h58.9c16.8 0 25.3-8.4 20.4-25-11.2-34.9-86.9-106.7-90.3-111.5-8.7-11.2-6.2-16.2 0-26.2.1-.1 72-101.3 79.4-135.6z" ></path> </svg> </a> <a class="gnzs-description-widget__contact-elem" href="https://t.me/gnzs_bot" target="_blank"> <svg title="Telegram" viewBox="0 0 496 512" class="gnzs-description-widget__icon" > <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z" ></path> </svg> </a> <a class="gnzs-description-widget__contact-elem" href="https://api.whatsapp.com/send?phone=79960650732&text=%D0%A5%D0%BE%D1%87%D1%83%20%D0%B8%D0%BD%D1%82%D0%B5%D0%B3%D1%80%D0%B0%D1%86%D0%B8%D1%8E%20amoCRM%20%D0%B8%20WhatsApp&ref=amo_leadcopier&ref_source=amo_market" target="_blank" > <svg title="WhatsApp" viewBox="0 0 448 512" class="gnzs-description-widget__icon" > <path fill="currentColor" d="M224 122.8c-72.7 0-131.8 59.1-131.9 131.8 0 24.9 7 49.2 20.2 70.1l3.1 5-13.3 48.6 49.9-13.1 4.8 2.9c20.2 12 43.4 18.4 67.1 18.4h.1c72.6 0 133.3-59.1 133.3-131.8 0-35.2-15.2-68.3-40.1-93.2-25-25-58-38.7-93.2-38.7zm77.5 188.4c-3.3 9.3-19.1 17.7-26.7 18.8-12.6 1.9-22.4.9-47.5-9.9-39.7-17.2-65.7-57.2-67.7-59.8-2-2.6-16.2-21.5-16.2-41s10.2-29.1 13.9-33.1c3.6-4 7.9-5 10.6-5 2.6 0 5.3 0 7.6.1 2.4.1 5.7-.9 8.9 6.8 3.3 7.9 11.2 27.4 12.2 29.4s1.7 4.3.3 6.9c-7.6 15.2-15.7 14.6-11.6 21.6 15.3 26.3 30.6 35.4 53.9 47.1 4 2 6.3 1.7 8.6-1 2.3-2.6 9.9-11.6 12.5-15.5 2.6-4 5.3-3.3 8.9-2 3.6 1.3 23.1 10.9 27.1 12.9s6.6 3 7.6 4.6c.9 1.9.9 9.9-2.4 19.1zM400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM223.9 413.2c-26.6 0-52.7-6.7-75.8-19.3L64 416l22.5-82.2c-13.9-24-21.2-51.3-21.2-79.3C65.4 167.1 136.5 96 223.9 96c42.4 0 82.2 16.5 112.2 46.5 29.9 30 47.9 69.8 47.9 112.2 0 87.4-72.7 158.5-160.1 158.5z" ></path> </svg> </a> </div>`;
};

export const widgetActivationStyles = () => {
  return `<style>.gnzs-widget-activation-container{display: flex; align-items: center; justify-content: space-between;}.gnzs-widget-activation{display: flex; align-items: center; font-size: 13px;}.gnzs-widget-activation__text{color: #52c7a0; border: 1px solid #52c7a0; padding: 3px 10px; border-radius: 3px 0 0 3px; background: rgba(36,188,140,.05);}.gnzs-widget-activation__button{border: 1px solid #52c7a0; padding: 3px 10px; border-radius: 0 3px 3px 0; border-left: none; color: #fff; font-weight: bold; background: #52c7a0; text-decoration: none;}.gnzs-widget-activation_warning .gnzs-widget-activation__text{color: #ecbc29; border-color: #ecbc29; background: rgba(236,188,41,.05);}.gnzs-widget-activation_warning .gnzs-widget-activation__button{border-color: #ecbc29; background-color: #ecbc29;}.gnzs-widget-activation_error .gnzs-widget-activation__text{color: #f37575; border-color: #f37575; background: rgb(243,117,117,.05);}.gnzs-widget-activation_error .gnzs-widget-activation__button{border-color: #f37575; background-color: #f37575;}</style>`;
};

export const widgetInfoStyles = () => {
  return `<style>.gnzs-description-widget__messangers-container{display: flex; align-items: center;}.gnzs-description-widget__contact-elem{display: inline-flex; align-items: center; color: #adadad;}.gnzs-description-widget__contact-elem:hover{color: #ffc40d; transition: color 0.3s;}.gnzs-description-widget__contact-elem:hover > svg{color: #ffc40d; transition: color 0.3s;}.gnzs-description-widget__messangers-container .gnzs-description-widget__contact-elem{flex-direction: column; font-size: 12px; margin-right: 12px;}.gnzs-description-widget__messangers-container .gnzs-description-widget__contact-elem:last-child{margin-right: 0;}.gnzs-description-widget__icon{overflow: visible; color: #adadad;}.gnzs-description-widget__messangers-container .gnzs-description-widget__icon{width: 20px; height: 23px;}.gnzs-description-widget__messangers-container-title{color: gray; font-size: 13px; margin-right: 7px;}.gnzs-description-widget__company-links{display: flex; align-items: center; margin-top: 15px; justify-content: space-between; padding: 10px; border: 1px solid #e1e3e4; border-radius: 3px;}</style>`;
};

export type LanguageType = 'ru' | 'en' | 'es' | 'pt';

export const isDevMode = () => {
  return process.env.MODE != 'prod';
};

export const LOCALE = {
  ru: {
    PAYMENT_URL: () => PAYMENT_URL,
    ACITVATION_EXPIRED: () => `Период активации закончился`,
    ACITVATION_SOON_EXPIRED: (daysLeft: number) =>
      `Виджет отключится через ${daysLeft} ${numeralWord(daysLeft, ['день', 'дня', 'дней'])}. Продлите активацию`,
    PHONE_NOT_VALID: () => `Проверьте корректность ввода номера телефона для технической поддержки`,
    BUTTON_PROLONG: () => `Продлить`,
    BUTTON_SEE_DETAIL: () => `Подробнее об интеграции`,
    BUTTON_GRANT_AUTH: () => `Выдать доступ к авторизации`,
    CONTACT_US: () => contactUsHtml_ru(),
    AMO_AUTH_ERROR_TEXT: () => `Ошибка авторизации. Необходимо повторно выдать доступ (кликните по уведомлению)`,
  },
  en: {
    PAYMENT_URL: () => PAYMENT_URL,
    ACITVATION_EXPIRED: () => `Activation period has expired`,
    ACITVATION_SOON_EXPIRED: (daysLeft: number) => `The widget will turn off after ${daysLeft} days. Extend activation`,
    PHONE_NOT_VALID: () => `Phone number is invalid`,
    BUTTON_PROLONG: () => `Prolong`,
    BUTTON_SEE_DETAIL: () => `See detail about integration`,
    BUTTON_GRANT_AUTH: () => `Grant authorization access`,
    CONTACT_US: () => '',
    AMO_AUTH_ERROR_TEXT: () => `Authorisation Error. You need to re-grant access (click here)`,
  },
  es: {
    PAYMENT_URL: () => PAYMENT_URL,
    ACITVATION_EXPIRED: () => `El período de activación ha finalizado`,
    ACITVATION_SOON_EXPIRED: (daysLeft: number) => `El widget se apagará después de ${daysLeft} días. Ampliar activación`,
    PHONE_NOT_VALID: () => `El número de teléfono no es válido`,
    BUTTON_PROLONG: () => `Ampliar`,
    BUTTON_SEE_DETAIL: () => `Más sobre integración`,
    BUTTON_GRANT_AUTH: () => `Otorgar acceso de autorización`,
    CONTACT_US: () => '',
    AMO_AUTH_ERROR_TEXT: () => `Error de autorización. Necesita volver a otorgar acceso (haga clic aquí)`,
  },
  pt: {
    PAYMENT_URL: () => PAYMENT_URL,
    ACITVATION_EXPIRED: () => `O período de ativação terminou`,
    ACITVATION_SOON_EXPIRED: (daysLeft: number) => `O widget será desligado após ${daysLeft} dias. Estender a ativação`,
    PHONE_NOT_VALID: () => `O número de telefone é inválido`,
    BUTTON_PROLONG: () => `Ampliar`,
    BUTTON_SEE_DETAIL: () => `Mais sobre integração`,
    BUTTON_GRANT_AUTH: () => `Conceder acesso de autorização`,
    CONTACT_US: () => '',
    AMO_AUTH_ERROR_TEXT: () => `Erro de autorização. Você precisa conceder novamente o acesso (clique aqui)`,
  },
};

export const safeStringify = (obj: any) => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]'; // Замена циклической ссылки
      }
      seen.add(value);
    }
    return value;
  });
};

export const serializedError = (e: any) => {
  return JSON.parse(
    safeStringify({
      message: e.message,
      name: e.name,
      stack: e.stack,
      code: e.code,
      status: e.status,
      statusText: e.statusText,
      response: e.response,
      request: e.request,
    }),
  );
};

export const camelCaseKeys = <T extends Record<string, any>>(object: T) => {
  const camelCased = {};
  Object.entries(object).forEach(([k, value]) => {
    const key = [];
    k.split('_').forEach((v, i) => (i > 0 ? key.push(v.charAt(0).toUpperCase() + v.slice(1)) : key.push(v)));
    camelCased[key.join('')] = value;
  });

  return camelCased;
};

export const getNonMatchingElements = (array1: any[], array2: any[], criteria: (first: any, second: any) => boolean) => {
  const nonMatchingElements = [];
  for (let i = 0; i < array1.length; i++) {
    let found = false;

    for (let j = 0; j < array2.length; j++) {
      if (criteria(array1[i], array2[j])) {
        found = true;
        break;
      }
    }

    if (!found) {
      nonMatchingElements.push(array1[i]);
    }
  }

  return nonMatchingElements;
};

export const preparePhone = (phone: string | number): number | null => {
  if (typeof phone === 'number') phone = String(phone);
  if (!phone.length) return null;

  let [preparedPhone] = phone.match(/\d+/g);
  if (preparedPhone[0] === '8') preparedPhone = '7' + preparedPhone.slice(1);
  return parseInt(preparedPhone);
};

export const deepClone = (object: Record<string, any>) => JSON.parse(JSON.stringify(object));
