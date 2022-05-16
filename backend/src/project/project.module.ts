import { Module } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { TaskService } from './task/task.service'
import { TaskController } from './task/task.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Project, ProjectSchema } from './project.schema'
import { DaoModule } from 'src/dao/dao.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]), DaoModule, UserModule],
  providers: [ProjectService, TaskService],
  controllers: [ProjectController, TaskController],
})
export class ProjectModule {}
