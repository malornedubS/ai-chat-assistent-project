import { Entity, Column, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { AvitoAccountsEntity } from './avito-accounts.entity';

@Entity('avito_tokens')
export class AvitoTokensEntity {
  @PrimaryColumn()
  avitoAccountId: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => AvitoAccountsEntity)
  @JoinColumn({
    name: 'avito_account_id',
    referencedColumnName: 'avitoAccountId',
  })
  avitoAccount: AvitoAccountsEntity;
}
