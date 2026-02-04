import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import { DaoModule } from './dao.module'
import { DaoService } from './dao.service'

describe('DaoService', () => {
  let service: DaoService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RuntimeModule, DaoModule],
    }).compile()

    service = module.get<DaoService>(DaoService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
