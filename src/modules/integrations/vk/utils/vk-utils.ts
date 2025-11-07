import * as crypto from 'crypto';
import { VkAttachmentDto } from '../dto/vk-send-message.dto';

/**
 * Генерация случайной строки для code_verifier
 */
export function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Генерация code_challenge из code_verifier
 */
export function generateCodeChallenge(codeVerifier: string): string {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return hash.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Генерация PKCE параметров
 */
export function generatePkceParams(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}
/**
 * Для работы с state
 */
export class VkStateUtil {
  static encode(payload: object): string {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  static decode<T = any>(state: string): T {
    return JSON.parse(Buffer.from(state, 'base64').toString('utf-8')) as T;
  }
}

/**
 * Для работы с VK пользователями
 */
export class VkUserUtils {
  static createVkUserDto(userInfo: any): { vkUserId: number; fullName: string } {
    return {
      vkUserId: userInfo.id,
      fullName: `${userInfo.first_name} ${userInfo.last_name}`.trim(),
    };
  }
}

export function serializeAttachments(attachments?: VkAttachmentDto[]): string | undefined {
  if (!attachments?.length) return undefined;

  return attachments
    .map((a) => {
      const base = `${a.type}${a.ownerId}_${a.mediaId}`;
      return a.accessKey ? `${base}_${a.accessKey}` : base;
    })
    .join(',');
}
