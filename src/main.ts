import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { ConfigApp } from './config/app/config.app'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await ConfigApp(app)
}
void bootstrap()
