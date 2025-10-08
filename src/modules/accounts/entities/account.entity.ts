import { AmoAccountEntity } from 'src/modules/amo-accounts/entities/amo-account.entity';
import { AvitoAccountEntity } from 'src/modules/integrations/avito/entities/avito-accounts.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;

  @OneToOne(() => AmoAccountEntity, (amoAccount) => amoAccount.account)
  amoAccounts: AmoAccountEntity;

  @OneToMany(() => AvitoAccountEntity, (avitoAccount) => avitoAccount.account)
  avitoAccount: AvitoAccountEntity[];
}
