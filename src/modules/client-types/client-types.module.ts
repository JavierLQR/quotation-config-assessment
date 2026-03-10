import { Module } from '@nestjs/common'

import { ClientTypesResolver } from './client-types.resolver'
import { ClientTypesService } from './client-types.service'
import {
  CLIENT_TYPES_REPOSITORY,
  ClientTypesRepositoryPrisma,
} from './repositories'

@Module({
  providers: [
    ClientTypesResolver,
    ClientTypesService,
    {
      provide: CLIENT_TYPES_REPOSITORY,
      useClass: ClientTypesRepositoryPrisma,
    },
  ],
  exports: [ClientTypesService],
})
export class ClientTypesModule {}
