import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { GraphqlModule } from './config/graphql'
import { PrismaModule } from './prisma'
import { PlantsModule } from './modules/plants/plants.module'
import { ClientTypesModule } from './modules/client-types/client-types.module'
import { ClientsModule } from './modules/clients/clients.module'
import { MarginConfigsModule } from './modules/margin-configs/margin-configs.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphqlModule,
    PrismaModule,
    PlantsModule,
    ClientTypesModule,
    ClientsModule,
    MarginConfigsModule,
  ],
})
export class AppModule {}
