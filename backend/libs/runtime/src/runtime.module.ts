import { DatabaseModule } from '@app/database'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule, ServeStaticModuleOptions } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          rootPath: join(config.get('FRONTEND_BUILD_PATH')),
        } as ServeStaticModuleOptions,
      ],
    }),
    DatabaseModule,
  ],
  providers: [],
  exports: [],
})
export class RuntimeModule {}
