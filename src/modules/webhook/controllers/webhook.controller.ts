import { Body, Controller, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { AmoWebhookDto } from '../dto/amocrm-webhook.dto';
import { AmoCrmService } from 'src/modules/integrations/amo-crm/services/amo-crm.service';
import { AvitoService } from 'src/modules/integrations/avito/services/avito.service';
// import { AvitoWebhookDto } from '../../integrations/avito/dto/avito-webhook.dto';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly amocrmService: AmoCrmService,
    private readonly avitoService: AvitoService,
  ) {}

  @Post('amocrm')
  async processWebhook(@Body() webhook: AmoWebhookDto): Promise<void> {
    return this.amocrmService.processWebhook(webhook);

    // @Post('avito')
    // async processAvitoWebhook(@Body() webhook: AvitoWebhookDto): Promise<void> {
    //     return this.avitoService.processWebhook(webhook);
    // }
  }
}
