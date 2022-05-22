import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateTaskDto, TaskDto, TaskQueryDto } from './task.dto'
import { TaskService } from './task.service'

@ApiBearerAuth()
@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post('find')
  @HttpCode(200)
  find(@Body() query: TaskQueryDto): Promise<TaskDto[]> {
    return this.taskService.find(query)
  }

  @Post()
  @HttpCode(200)
  create(@Body() task: CreateTaskDto): Promise<TaskDto> {
    return this.taskService.create(task)
  }

  @Get(':taskId')
  @HttpCode(200)
  read(@Param('taskId') taskId: string): Promise<TaskDto> {
    return this.taskService.read(taskId)
  }

  @Put(':taskId')
  @HttpCode(200)
  update(@Param('taskId') taskId: string, @Body() taskDto: TaskDto): Promise<TaskDto> {
    taskDto.taskId = taskId
    return this.taskService.update(taskDto)
  }

  @Delete(':taskId')
  @HttpCode(200)
  delete(@Param('taskId') taskId: string): Promise<void> {
    return this.taskService.delete(taskId)
  }
}
