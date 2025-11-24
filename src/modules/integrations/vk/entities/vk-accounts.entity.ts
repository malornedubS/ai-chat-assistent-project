import { AccountEntity } from 'src/modules/accounts/entities/account.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { VkUsersTokenEntity } from './vk-users-tokens.entity';
import { VkGroupsTokenEntity } from './vk-groups-tokens.entity';

@Entity('vk_accounts')
export class VkAccountsEntity {
  @Column()
  accountId: number;

  @PrimaryColumn()
  vkUserId: number;

  @Column()
  fullName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AccountEntity, (account) => account.vkUsers)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @OneToOne(() => VkUsersTokenEntity, (token) => token.vkUser)
  token: VkUsersTokenEntity;

  @OneToMany(() => VkGroupsTokenEntity, (groupToken) => groupToken.vkAccount)
  groupTokens: VkGroupsTokenEntity[];
}
