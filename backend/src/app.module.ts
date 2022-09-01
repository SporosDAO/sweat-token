import { RuntimeModule } from '@app/runtime'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [EventEmitterModule.forRoot(), RuntimeModule, AuthModule, UserModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
