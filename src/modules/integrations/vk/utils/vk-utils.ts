import * as crypto from 'crypto';
import { VkAttachmentDto } from '../dto/vk-send-message.dto';
import { VkUserDto } from '../dto/vk-accounts.dto';

/**
 * PKCE utils
 */
export function generateRandomString(len: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function generateCodeChallenge(codeVerifier: string): string {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return hash.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function generatePkceParams() {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}

/**
 * OAuth state helpers
 */
export function encodeVkState(payload: object): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function decodeVkState<T>(state: string): T {
  return JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
}

/**
 * VK user helpers
 */
export function buildVkUserDto(user: VkApiUser): VkUserDto {
  return {
    vkUserId: user.id,
    fullName: `${user.first_name} ${user.last_name}`.trim(),
  };
}

/**
 * Attachments
 */
export function serializeAttachments(att?: VkAttachmentDto[]): string | undefined {
  if (!att || att.length === 0) return undefined;

  return att
    .map((a) => {
      const base = `${a.type}${a.ownerId}_${a.mediaId}`;
      return a.accessKey ? `${base}_${a.accessKey}` : base;
    })
    .join(',');
}

export interface VkApiUser {
  id: number;
  first_name: string;
  last_name: string;
  can_access_closed?: boolean;
  is_closed?: boolean;
}
