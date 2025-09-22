export interface AvitoMessage {
  id: string;
  author_id: number;
  created: number;
  content: AvitoMessageContent;
  type: string;
  direction: 'in' | 'out';
  isRead: boolean;
  read: number;
}

export interface AvitoMessageContent {
  text: string;
}

export interface AvitoMessageRequest {
  type: 'text';
  message: {
    text: string;
  };
}

export interface AvitoMessagesResponse {
  messages: AvitoMessage[];
}

export interface AvitoSendMessageParams {
  userId: number;
  chatId: string;
  text: string;
}

export class AvitoGetStoryMessagesDto {
  userId: string;
  chatId: string;
  limit: number;
  offset: string;
}
