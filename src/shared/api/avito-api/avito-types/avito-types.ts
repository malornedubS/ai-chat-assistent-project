export enum MessageTypes {
  text = 'text',
  image = 'image',
  call = 'call',
  flow_id = 'flow_id',
  voice = 'voice',
  item = 'item',
  link = 'link',
  location = 'location',
}

export type MessageDirection = 'in' | 'out';

export interface AvitoGetStoryMessagesDto {
  userId: string;
  chatId: string;
  limit: number;
  offset: string;
}

export interface AvitoMessage {
  id: string;
  author_id: number;
  created: number;
  content: AvitoMessageContent;
  type: string;
  direction: MessageDirection;
  isRead: boolean;
  read: number;
}

export interface AvitoMessageContent {
  text?: string;
  image?: AvitoMessageImage;
  voice?: AvitoMessageVoice;
  call?: any;
  flow_id?: string;
  item?: any;
  link?: string;
  location?: any;
}

export interface AvitoMessageImage {
  sizes: Record<string, string>;
}

export interface AvitoMessageVoice {
  voice_id: string;
}

export interface AvitoSendMessageParams {
  userId: number;
  chatId: string;
  text?: string;
  imageIds?: string[];
}

export interface AvitoMessageRequest {
  type: MessageTypes;
  message: {
    text: string;
  };
}

export interface AvitoMessageResponse {
  content: AvitoMessageContent;
  created: number;
  direction: MessageDirection;
  id: string;
  type: MessageTypes;
}
export interface AvitoImageMessageResponse {
  author_id: number;
  content: {
    image: AvitoMessageImage;
  };
  created: number;
  direction: MessageDirection;
  id: string;
  type: MessageTypes;
}

export interface AvitoStoryMessagesResponse {
  messages: AvitoMessage[];
}

export interface AvitoImageUploadResponse {
  id: string;
  url: string;
  name: string;
}
