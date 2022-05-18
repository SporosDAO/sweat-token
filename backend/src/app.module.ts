import { RuntimeModule } from '@app/runtime'
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { DaoModule } from './dao/dao.module'

@Module({
  imports: [RuntimeModule, AuthModule, DaoModule],
})
export class AppModule {}
