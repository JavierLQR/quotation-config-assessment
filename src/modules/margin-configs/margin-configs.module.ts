import { Module } from '@nestjs/common'

import { MarginConfigsResolver } from './margin-configs.resolver'
import { MarginConfigsService } from './margin-configs.service'
import {
  MARGIN_CONFIGS_REPOSITORY,
  MarginConfigsRepositoryPrisma,
} from './repositories'

@Module({
  providers: [
    MarginConfigsResolver,
    MarginConfigsService,
    {
      provide: MARGIN_CONFIGS_REPOSITORY,
      useClass: MarginConfigsRepositoryPrisma,
    },
  ],
  exports: [MarginConfigsService],
})
export class MarginConfigsModule {}
