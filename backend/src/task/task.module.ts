import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from 'src/user/user.module'
import { Task, TaskSchema } from './task.schema'
import { TaskService } from './task.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]), UserModule],
  providers: [TaskService],
  exports: [TaskService],
  controllers: [],
})
export class TaskModule {}
