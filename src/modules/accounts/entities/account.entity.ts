import { AmoAccountEntity } from 'src/modules/amo-accounts/entities/amo-account.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
