import { INestApplication, Logger, ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import { NextFunction, Request, Response } from 'express'

import helmet from 'helmet'

export const ConfigApp = async (app: INestApplication) => {
  const logger: Logger = new Logger('ConfigApp')

  const isProd = process.env.NODE_ENV === 'production'
  const allowedOrigin = isProd ? '' : 'http://localhost:3000'

  const expressApp = app
    .getHttpAdapter()
    .getInstance() as NestExpressApplication

  expressApp.set('trust proxy', 1)

  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin

    if (!isProd && origin === allowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin)
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,DELETE,PATCH,OPTIONS',
      )
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type,Authorization,apollo-require-preflight',
      )
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 204
      res.end()
      return
    }

    next()
  })

  app.use(cookieParser())

  app.use(
    helmet({
      contentSecurityPolicy: isProd ? undefined : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  )

  app.use((_: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow')
    next()
  })

  app.useLogger(
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  )

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422,
    }),
  )

  const PORT = process.env.PORT ?? 4000

  const apiPrefix = 'api-v1'
  app.setGlobalPrefix(apiPrefix)

  await app.listen(PORT)
  const url = await app.getUrl()

  if (isProd)
    return logger.log(`
    ==================================================
    🚀 Server is running!
    Environment : ${process.env.NODE_ENV}
    Port        : ${PORT}
    GraphQL     : ${url}/${apiPrefix}/graphql
    Playground  : Disabled (production)
    ==================================================
  `)

  logger.verbose(`
    ==================================================
    🚀 Server is running!
    Environment : ${process.env.NODE_ENV}
    Port        : ${PORT}
    GraphQL     : http://localhost:${PORT}/${apiPrefix}/graphql
    Playground  : ${process.env.GRAPHQL_PLAYGROUND === 'true' ? 'Enabled' : 'Disabled'}
    Debug       : ${process.env.GRAPHQL_DEBUG === 'true' ? 'Enabled' : 'Disabled'}
    ==================================================
  `)
}
