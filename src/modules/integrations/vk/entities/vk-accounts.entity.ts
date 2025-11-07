import { AccountEntity } from 'src/modules/accounts/entities/account.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { VkTokenEntity } from './vk-tokens.entity';
import { VkGroupsTokenEntity } from './vk-groups-tokens';

@Entity('vk_accounts')
export class VkAccountsEntity {
  @PrimaryColumn()
  vkUserId: number;

  @Column()
  accountId: number;

  @Column()
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AccountEntity, (account) => account.vkUsers)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @OneToOne(() => VkTokenEntity, (token) => token.vkUser)
  token: VkTokenEntity;

  @OneToMany(() => VkGroupsTokenEntity, (groupToken) => groupToken.vkAccount)
  groupTokens: VkGroupsTokenEntity[];
}
