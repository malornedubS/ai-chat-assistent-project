import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjsx/crud/lib/crud';

@Entity('bots')
export class Bot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id' })
  accountId: number;

  @ApiProperty({
    description: 'Модель ИИ, которую нужно использовать',
    example: 'gpt-4o',
  })
  @Column({ default: 'gpt-4o' })
  model: string;

  @ApiProperty({
    description: 'Системные инструкции — определяют поведение ассистента',
    example: 'Ты — вежливый помощник в интернет-магазине. Отвечай кратко и по делу.',
  })
  @Column({ type: 'text', nullable: true })
  instructions: string;

  @ApiProperty({
    description: 'Максимальное количество токенов в ответе',
    example: 1024,
  })
  @Column({ name: 'max_output_tokens', default: 1024 })
  maxOutputTokens: number;

  @ApiProperty({
    description: 'Параметр температуры: креативность ответа (0 = строго, 2 = креативно)',
    example: 0.7,
  })
  @Column({ type: 'float', default: 0.7 })
  temperature: number;
}
