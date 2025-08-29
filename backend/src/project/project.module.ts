import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from 'src/user/user.module'
import { Project, ProjectSchema } from './project.schema'
import { ProjectService } from './project.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]), UserModule],
  providers: [ProjectService],
  controllers: [],
  exports: [ProjectService],
})
export class ProjectModule {}
