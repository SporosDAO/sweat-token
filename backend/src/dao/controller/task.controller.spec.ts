import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import { TaskController } from './task.controller'
import { TaskModule } from '../../task/task.module'

describe('TaskController', () => {
  let controller: TaskController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RuntimeModule, TaskModule],
    }).compile()

    controller = module.get<TaskController>(TaskController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
