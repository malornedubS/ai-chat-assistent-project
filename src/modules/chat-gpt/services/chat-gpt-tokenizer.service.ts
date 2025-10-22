import { Injectable } from '@nestjs/common';
import { encodingForModel } from 'js-tiktoken';
import { ChatGptMessageDto } from '../dto/chat-gpt-create.dto';
import { TiktokenModel } from '@dqbd/tiktoken';

@Injectable()
export class ChatGptTokenizerService {
  countTokens(messages: ChatGptMessageDto[], model: string, instructions = ''): number {
    const enc = encodingForModel(model as TiktokenModel);
    let tokens = 0;

    if (instructions.trim()) {
      tokens += 2 + enc.encode(instructions).length;
    }

    for (const { role, content } of messages) {
      tokens += 2 + enc.encode(role).length + enc.encode(content).length;
    }

    return tokens;
  }
}
