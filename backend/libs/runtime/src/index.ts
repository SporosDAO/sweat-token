import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger'
export * from './runtime.module'

const setupOpenapi = async (app: INestApplication): Promise<void> => {
  const config = new DocumentBuilder()
    .setTitle('Sweat Token')
    .setDescription('Sweat Token API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    useGlobalPrefix: true,
  }
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, customOptions)
}

export async function bootstrap(module: any): Promise<INestApplication> {
  const app = await NestFactory.create(module, {
    cors: true,
  })

  app.setGlobalPrefix('/api')

  setupOpenapi(app)

  await app.listen(3001)

  return app
}
