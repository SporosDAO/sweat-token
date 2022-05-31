import { Module } from '@nestjs/common'
import { DaoService } from './dao.service'
import { DaoController } from './dao.controller'
import { Dao, DaoSchema } from './dao.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { MemberModule } from 'src/member/member.module'
import { DaoMemberController } from './dao.member.controller'
import { ProjectEventListenerService } from './dao.project.listener.service'
import { TaskModule } from 'src/task/task.module'
import { ProjectModule } from 'src/project/project.module'
import { DaoTaskController } from './dao.task.controller'
import { DaoProjectController } from './dao.project.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dao.name, schema: DaoSchema }]),
    MemberModule,
    TaskModule,
    ProjectModule,
  ],
  providers: [DaoService, ProjectEventListenerService],
  controllers: [DaoController, DaoMemberController, DaoTaskController, DaoProjectController],
  exports: [DaoService],
})
export class DaoModule {}
