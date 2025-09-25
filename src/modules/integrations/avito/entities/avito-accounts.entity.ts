import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

import { AvitoTokensEntity } from './avito-tokens.entity';
import { AccountEntity } from 'src/modules/accounts/entities/account.entity';

@Entity('avito_accounts')
export class AvitoAccountEntity {
  @PrimaryColumn()
  accountId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  subdomain: string;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  info: object;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => AvitoTokensEntity, (token) => token.avitoAccount)
  tokens: AvitoTokensEntity[];

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
