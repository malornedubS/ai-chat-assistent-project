import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { AvitoAccountEntity } from './avito-accounts.entity';

@Entity('avito_tokens')
export class AvitoTokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'avito_user_id' })
  avitoUserId: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken?: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => AvitoAccountEntity)
  @JoinColumn({ name: 'avito_user_id', referencedColumnName: 'avitoUserId' })
  avitoAccount: AvitoAccountEntity;
}
