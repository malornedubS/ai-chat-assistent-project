import { Module } from '@nestjs/common';
import { AmoAccountEntity } from './entities/amo-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmoAccountsController } from './amo-accounts.controller';
import { AmoAccountsService } from './amo-accounts.service';
import { GnzsCacheService } from 'src/shared/cache';

@Module({
  imports: [TypeOrmModule.forFeature([AmoAccountEntity])],
  controllers: [AmoAccountsController],
  providers: [AmoAccountsService, GnzsCacheService],
})
export class AmoAccountsModule {}
