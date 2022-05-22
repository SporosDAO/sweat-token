import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DaoModule } from 'src/dao/dao.module'
import { TaskModule } from 'src/task/task.module'
import { UserModule } from 'src/user/user.module'
import { ProjectController } from './project.controller'
import { ProjectEventListenerService } from './project.event-listener.service'
import { Project, ProjectSchema } from './project.schema'
import { ProjectService } from './project.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    DaoModule,
    TaskModule,
    UserModule,
  ],
  providers: [ProjectService, ProjectEventListenerService],
  controllers: [ProjectController],
  exports: [ProjectService],
})
export class ProjectModule {}
