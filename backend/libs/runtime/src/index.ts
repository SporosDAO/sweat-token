import { INestApplication, ValidationPipe, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger'
export * from './runtime.module'

const bootstrapLogger = new Logger('BackendSetup')

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
  let cors
  let logger
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev') {
    cors = {
      origin: true, // ["http://localhost", "/.*\.gitpod\.io$/", "/.*\.sporosdao\.xyz$/"],
      credentials: true,
    }
    logger = ['log', 'debug', 'error', 'verbose', 'warn']
  } else {
    cors = {
      origin: true,
      credentials: true,
    }
    logger = ['error', 'warn']
  }

  const app = await NestFactory.create(module, { cors, logger })

  bootstrapLogger.debug(`process.env.NODE_ENV=${process.env.NODE_ENV}`)
  bootstrapLogger.debug('CORS:', cors)

  app.setGlobalPrefix('/api')
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
    }),
  )

  setupOpenapi(app)

  // heroku sets deployment web port
  // in process.env.PORT
  await app.listen(process.env.PORT || 3001)

  return app
}
