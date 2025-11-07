export class VkTokenResponse {
  access_token: string;
  expires_in: number;
  user_id: number;
  refresh_token: string;
}

export class VkAuthCodeResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
  user_id: number;
}

export interface VkUserInfo {
  id: number;
  first_name: string;
  last_name: string;
}

export interface VkSendMessageParams {
  peerId: number;
  message?: string;
  attachment?: string;
  keyboard?: any;
}

export interface VkSendMessageResponse {
  response: number;
}
