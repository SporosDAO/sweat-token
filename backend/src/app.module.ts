import { DatabaseModule } from '@app/database'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { v4 as uuidv4 } from 'uuid'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || `${uuidv4()}-${Math.random().toString(36)}`,
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_SEC') || '60s' },
      }),
    }),
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
