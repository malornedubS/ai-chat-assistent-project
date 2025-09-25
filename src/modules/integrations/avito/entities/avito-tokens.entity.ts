import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AvitoAccountEntity } from './avito-accounts.entity';

@Entity('avito_tokens')
export class AvitoTokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'avito_account_id' })
  avitoAccountId: number;

  @Column()
  accessToken: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AvitoAccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'avito_account_id' })
  avitoAccount: AvitoAccountEntity;
}
