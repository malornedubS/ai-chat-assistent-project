import { AccountEntity } from 'src/modules/accounts/entities/account.entity';

import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Info } from '../dto/info.account.dto';

@Entity('amo_accounts')
export class AmoAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  subdomain: string;

  @Column()
  isTech: boolean;

  @Column()
  paidTill: Date;

  @Column()
  tariff: string;

  @Column({ type: 'int' })
  usersCount: number;

  @Column({ type: 'jsonb', nullable: true })
  info: Info;

  @Column({ type: 'jsonb', nullable: true })
  objectAmo: object;

  @Column({ type: 'jsonb', nullable: true })
  users: object;

  @Column({ type: 'jsonb', nullable: true })
  groups: object;

  @Column({ type: 'jsonb', nullable: true })
  taskTypes: object;

  @Column({ type: 'jsonb', nullable: true })
  pipelines: object;

  @Column({ type: 'jsonb', nullable: true })
  customFields: object;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @OneToOne(() => AccountEntity, (account) => account.amoAccounts, {
    cascade: true,
  })
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
