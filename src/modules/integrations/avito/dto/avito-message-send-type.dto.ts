import {
  AvitoMessageImage,
  MessageDirection,
  MessageTypes,
} from 'src/shared/api/avito-api/types/avito-message-types';

export class AvitoMessageResponseDto {
  author_id?: number;
  content: {
    text?: string;
    image?: AvitoMessageImage;
  };
  created: number;
  direction: MessageDirection;
  id: string;
  type: MessageTypes;
}
