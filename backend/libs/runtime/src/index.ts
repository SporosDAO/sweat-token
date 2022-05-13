import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
export * from './runtime.module'

export async function bootstrap(module: any): Promise<INestApplication> {
  const app = await NestFactory.create(module, {
    cors: true,
  })

  await app.listen(3000)

  return app
}
