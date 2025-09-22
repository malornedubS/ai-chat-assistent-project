import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GnzsCacheService } from './cache.service';

@Controller('cache')
@ApiTags('cache')
export class CacheController {
  constructor(private readonly cacheService: GnzsCacheService) {}

  @Delete('/clear/:id') // Очистит конкретный
  clearOne(@Param('id') id: number) {
    return this.cacheService.amoAccount.del(id);
  }
}
