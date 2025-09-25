import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LokiLogger } from 'gnzs-platform-modules';
import AvitoApi from './avito-api/avito-api.class';

@Module({
  imports: [HttpModule],
  providers: [LokiLogger, AvitoApi],
  exports: [AvitoApi],
})
export class AvitoApiModule {}
