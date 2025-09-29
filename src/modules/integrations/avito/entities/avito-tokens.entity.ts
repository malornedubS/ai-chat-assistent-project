import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { AvitoAccountEntity } from './avito-accounts.entity';

@Entity('avito_tokens')
export class AvitoTokensEntity {
  @PrimaryColumn()
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
