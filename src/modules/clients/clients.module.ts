import { Module } from '@nestjs/common'

import { ClientsResolver } from './clients.resolver'
import { ClientsService } from './clients.service'
import { CLIENTS_REPOSITORY, ClientsRepositoryPrisma } from './repositories'

@Module({
  providers: [
    ClientsResolver,
    ClientsService,
    {
      provide: CLIENTS_REPOSITORY,
      useClass: ClientsRepositoryPrisma,
    },
  ],
  exports: [ClientsService],
})
export class ClientsModule {}
