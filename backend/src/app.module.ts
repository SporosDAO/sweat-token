import { RuntimeModule } from '@app/runtime'
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [RuntimeModule, AuthModule],
})
export class AppModule {}
