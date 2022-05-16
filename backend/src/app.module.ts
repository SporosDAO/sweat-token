import { RuntimeModule } from '@app/runtime'
import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { DaoModule } from './dao/dao.module'
import { ProjectModule } from './project/project.module'
import { UserModule } from './user/user.module';

@Module({
  imports: [RuntimeModule, AuthModule, DaoModule, ProjectModule, UserModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
