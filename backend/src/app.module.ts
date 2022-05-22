import { RuntimeModule } from '@app/runtime'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AuthModule } from './auth/auth.module'
import { DaoModule } from './dao/dao.module'
import { ProjectModule } from './project/project.module'
import { TaskModule } from './task/task.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [EventEmitterModule.forRoot(), RuntimeModule, AuthModule, DaoModule, ProjectModule, TaskModule, UserModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
