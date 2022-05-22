import { toDTO } from '@app/runtime/util'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { CreateTaskDto, RecordEventType, TaskDto, TaskEvent, TaskQueryDto, TaskStatus } from './task.dto'
import { Task, TaskDocument } from './task.schema'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class TaskService {
  constructor(private eventEmitter: EventEmitter2, @InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  toDto(doc: TaskDocument): TaskDto {
    return toDTO<TaskDto>(doc)
  }

  private emit(type: RecordEventType, task: TaskDto | TaskDocument) {
    this.eventEmitter.emit('task.changed', {
      taskId: task.taskId,
      projectId: task.projectId,
      daoId: task.daoId,
      type,
    } as TaskEvent)
  }

  async create(taskDto: CreateTaskDto): Promise<TaskDto> {
    taskDto.status = TaskStatus.open
    const task = new this.taskModel(taskDto)
    await task.save()
    this.emit('create', task)
    return this.toDto(task)
  }

  async read(taskId: string): Promise<TaskDto> {
    const task = await this.taskModel.findOne({ taskId }).exec()
    return task ? this.toDto(task) : null
  }

  async update(taskDto: TaskDto): Promise<TaskDto> {
    if (!taskDto) throw new BadRequestException()
    const { taskId } = taskDto
    if (taskId) throw new BadRequestException()
    const task = await this.read(taskDto.taskId)
    if (!task) throw new NotFoundException()

    const updates = {
      ...task,
      ...taskDto,
    }

    const res = await this.taskModel.updateOne({ taskId }, updates)
    if (!res.matchedCount) throw new NotFoundException()

    this.emit('update', task)

    return await this.read(taskId)
  }

  async delete(taskId: string): Promise<void> {
    const task = await this.read(taskId)
    if (!task) return
    await this.taskModel.deleteOne({ taskId }).exec()
    this.emit('delete', task)
  }

  async deleteAll(): Promise<void> {
    await this.taskModel.deleteMany({}).exec()
  }

  async find(query: TaskQueryDto): Promise<TaskDto[]> {
    const q: FilterQuery<TaskDocument> = {}

    if (query.ownerId) q.ownerId = query.ownerId
    if (query.daoId) q.daoId = query.daoId

    const dateField = query.dateField || 'created'

    if (query.from) {
      q[dateField] = {
        $gte: query.from,
      }
    }
    if (query.to) {
      q[dateField] = q[dateField] || {}
      q[dateField].$lte = query.to
    }

    const find = this.taskModel.find(q)

    if (query.limit) find.limit(query.limit)
    if (query.skip) find.skip(query.limit)

    const res = await find.exec()
    return res.map((doc) => this.toDto(doc))
  }
}
