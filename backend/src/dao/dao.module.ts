import { Module } from '@nestjs/common'
import { DaoService } from './dao.service'
import { DaoController } from './controller/dao.controller'
import { Dao, DaoSchema } from './dao.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { MemberModule } from 'src/member/member.module'
import { MemberController } from './controller/member.controller'
import { ProjectEventListenerService } from './dao.project.listener.service'
import { TaskModule } from 'src/task/task.module'
import { ProjectModule } from 'src/project/project.module'
import { TaskController } from './controller/task.controller'
import { ProjectController } from './controller/project.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dao.name, schema: DaoSchema }]),
    MemberModule,
    TaskModule,
    ProjectModule,
  ],
  providers: [DaoService, ProjectEventListenerService],
  controllers: [DaoController, MemberController, TaskController, ProjectController],
  exports: [DaoService],
})
export class DaoModule {}
