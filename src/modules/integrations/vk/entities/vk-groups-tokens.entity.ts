import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VkAccountsEntity } from './vk-accounts.entity';

@Entity('vk_groups_tokens')
export class VkGroupsTokenEntity {
  @PrimaryColumn()
  vkUserId: number;

  @PrimaryColumn()
  vkGroupId: number;

  @Column()
  accessToken: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => VkAccountsEntity, (account) => account.groupTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vk_user_id' })
  vkAccount: VkAccountsEntity;
}
