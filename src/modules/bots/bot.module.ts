import { Module, forwardRef } from '@nestjs/common';
import { ChatGptModule } from '../chat-gpt/chat-gpt.module';
import { BotService } from './services/bots.service';
import { MessageModule } from '../messages/message.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Bot } from './entities/bot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bot]), MessageModule, forwardRef(() => ChatGptModule)],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
