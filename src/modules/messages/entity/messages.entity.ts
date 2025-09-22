import { ChatGptRole } from 'src/modules/chat-gpt/dto/chat-gpt-create.dto';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('messages')
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  botId: string;

  @Column()
  chatId: string;

  @Column()
  role: ChatGptRole;

  @Column()
  text: string;

  @Column()
  source: string;

  @Column()
  createdAt: Date;
}
