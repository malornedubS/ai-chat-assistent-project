export class AvitoMessageWebhookDto {
  id: string;
  timestamp: number;
  version: string;
  payload: AvitoPayloadDto;
}

export class AvitoPayloadDto {
  type: string;
  value: AvitoPayloadValueDto;
}

export class AvitoPayloadValueDto {
  author_id: number;
  chat_id: string;
  chat_type: string;
  content: AvitoContentDto;
  created: number;
  id: string;
  item_id: number;
  published_at: string;
  read: number;
  type: string;
  user_id: number;
}

export class AvitoContentDto {
  call?: Record<string, any>;
  flow_id?: string;
  item?: Record<string, any>;
  link?: Record<string, any>;
  location?: Record<string, any>;
  text?: string;
  voice?: Record<string, any>;
}
