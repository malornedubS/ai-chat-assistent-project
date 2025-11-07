import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { VkAccountsEntity } from './vk-accounts.entity';

@Entity('vk_tokens')
export class VkTokenEntity {
  @PrimaryColumn()
  vkUserId: number;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  idToken: string;

  @Column()
  deviceId: string;

  @Column()
  state: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => VkAccountsEntity, (user) => user.token)
  @JoinColumn({ name: 'vk_user_id' })
  vkUser: VkAccountsEntity;
}
