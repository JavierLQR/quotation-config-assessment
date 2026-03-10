import { Module } from '@nestjs/common'

import { PlantsResolver } from './plants.resolver'
import { PlantsService } from './plants.service'
import { PLANTS_REPOSITORY, PlantsRepositoryPrisma } from './repositories'

@Module({
  providers: [
    PlantsResolver,
    PlantsService,
    {
      provide: PLANTS_REPOSITORY,
      useClass: PlantsRepositoryPrisma,
    },
  ],
  exports: [PlantsService],
})
export class PlantsModule {}
