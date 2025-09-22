import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountEntity } from 'src/modules/accounts/entities/account.entity';

@Entity('tokens')
export class TokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  source: string;

  @Column()
  accessToken: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AccountEntity, (account) => account.id, {
    onDelete: 'CASCADE',
  })
  account: AccountEntity;
}
