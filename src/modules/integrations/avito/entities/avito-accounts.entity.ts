import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

import { AvitoTokensEntity } from './avito-tokens.entity';
import { AccountEntity } from 'src/modules/accounts/entities/account.entity';

@Entity('avito_accounts')
export class AvitoAccountsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: number;

  @Column()
  avitoAccountId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToOne(() => AvitoTokensEntity, (token) => token.avitoAccount)
  tokens: AvitoTokensEntity;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
