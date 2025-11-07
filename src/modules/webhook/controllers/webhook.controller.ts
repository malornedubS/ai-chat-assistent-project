import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AmoWebhookDto } from '../dto/amocrm-webhook.dto';
import { AmoCrmService } from 'src/modules/integrations/amo-crm/services/amo-crm.service';
import { AvitoService } from 'src/modules/integrations/avito/services/avito.service';
import { AvitoMessageWebhookDto } from 'src/modules/integrations/avito/dto/avito-message-webhook.dto';

// import { AvitoWebhookDto } from '../../integrations/avito/dto/avito-webhook.dto';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly amocrmService: AmoCrmService, private readonly avitoService: AvitoService) {}

  @Post('amocrm')
  async processWebhook(@Body() webhook: AmoWebhookDto): Promise<void> {
    return this.amocrmService.processWebhook(webhook);
  }

  @Post('avito')
  @ApiResponse({ status: 200, description: 'Вебхук успешно принят' })
  async processAvitoWebhook(@Body() body: AvitoMessageWebhookDto): Promise<{ status: string }> {
    console.log('AVITO WEBHOOK: ');
    console.log('Body:', JSON.stringify(body, null, 2));

    return { status: 'ok' };
  }

  @Post('vk')
  @HttpCode(200)
  handleWebhook(@Body() body: any): string {
    console.log('VK Webhook:', body);

    if (body.type === 'confirmation') {
      return ' f681b587';
    }

    if (body.type === 'message_new') {
      console.log('New message:', body.object.message);
    }

    return 'ok';
  }
}
