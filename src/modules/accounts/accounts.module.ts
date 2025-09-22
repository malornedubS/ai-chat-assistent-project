import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { GnzsCacheService } from 'src/shared/cache';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  controllers: [AccountsController],
  providers: [AccountsService, GnzsCacheService],
})
export class AccountsModule {}
