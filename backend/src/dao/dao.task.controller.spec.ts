import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import { DaoTaskController } from './dao.task.controller'
import { TaskModule } from '../task/task.module'

describe('TaskController', () => {
  let controller: DaoTaskController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RuntimeModule, TaskModule],
    }).compile()

    controller = module.get<DaoTaskController>(DaoTaskController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
