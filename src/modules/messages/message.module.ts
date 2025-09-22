import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageService } from './services/message.service';
import { Messages } from './entity/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messages])],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
