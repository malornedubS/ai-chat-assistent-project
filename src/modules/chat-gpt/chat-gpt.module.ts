import { Module, forwardRef } from '@nestjs/common';
import { ChatGptService } from './services/chat-gpt.service';
import { ChatGptController } from './controllers/chat-gpt.controller';
import { LokiLoggerModule } from 'gnzs-platform-modules';
import { BotModule } from '../bots/bot.module';
import { ChatGptTokenizerService } from './services/chat-gpt-tokenizer.service';

@Module({
  imports: [LokiLoggerModule, forwardRef(() => BotModule)],
  providers: [ChatGptService, ChatGptTokenizerService],
  controllers: [ChatGptController],
  exports: [ChatGptService],
})
export class ChatGptModule {}
