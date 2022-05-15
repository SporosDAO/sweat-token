import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './auth.jwt.strategy'
import { AuthService } from './auth.service'
import { User, UserSchema } from './user.schema'
import { UsersService } from './users.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_SEC') || '60s' },
      }),
    }),
  ],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
