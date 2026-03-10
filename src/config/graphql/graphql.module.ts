import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { Request, Response } from 'express'

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          autoSchemaFile: true,
          sortSchema: true,
          playground: false,
          plugins: [
            ApolloServerPluginLandingPageLocalDefault({
              embed: true,
              includeCookies: true,
            }),
          ],
          debug: configService.getOrThrow<boolean>('GRAPHQL_DEBUG', false),
          path: '/api-v1/graphql',
          uploads: false,
          csrfPrevention: false,
          context: ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res,
          }),
        }
      },
    }),
  ],
})
export class GraphqlModule {}
