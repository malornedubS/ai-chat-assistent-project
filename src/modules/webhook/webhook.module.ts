import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { AmoCrmService } from '../integrations/amo-crm/services/amo-crm.service';
import { BotModule } from '../bots/bot.module';
import { AvitoService } from '../integrations/avito/services/avito.service';
import { AvitoModule } from '../integrations/avito/avito.module';
import { AvitoApiModule } from 'src/shared/api/avito-api.module';

@Module({
  imports: [BotModule, AvitoApiModule, AvitoModule],
  controllers: [WebhookController],
  providers: [AmoCrmService, AvitoService],
})
export class WebhookModule {}
