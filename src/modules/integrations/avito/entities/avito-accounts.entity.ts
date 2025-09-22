import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from 'src/modules/accounts/entities/account.entity';

@Entity('avito_accounts')
export class AvitoAccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToOne(() => AccountEntity, { cascade: true })
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
