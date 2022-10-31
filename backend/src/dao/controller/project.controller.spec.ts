import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import { ProjectModule } from '../../project/project.module'
import { ProjectController } from './project.controller'

describe('ProjectController', () => {
  let controller: ProjectController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RuntimeModule, ProjectModule],
      controllers: [ProjectController],
    }).compile()

    controller = module.get(ProjectController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
