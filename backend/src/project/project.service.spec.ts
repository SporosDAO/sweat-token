import { Test, TestingModule } from '@nestjs/testing'
import { ProjectModule } from './project.module'
import { ProjectService } from './project.service'

describe('ProjectService', () => {
  let service: ProjectService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectModule],
    }).compile()

    service = module.get<ProjectService>(ProjectService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
