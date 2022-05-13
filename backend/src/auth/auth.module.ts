import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService } from './users.service'
import { AuthController } from './auth.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './user.schema'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './auth.jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './auth.jwt.guard'

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [
    AuthService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
