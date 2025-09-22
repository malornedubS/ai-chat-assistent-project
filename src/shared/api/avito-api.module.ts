import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LokiLogger } from 'gnzs-platform-modules';
import AvitoMessageApi from './avito-api/avito-message-api.class';

@Module({
  imports: [HttpModule],
  providers: [LokiLogger, AvitoMessageApi],
  exports: [AvitoMessageApi],
})
export class AvitoApiModule {}
