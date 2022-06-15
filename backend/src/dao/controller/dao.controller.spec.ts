import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import { DaoController } from './dao.controller'
import { DaoModule } from './dao.module'

describe('DaoController', () => {
  let controller: DaoController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RuntimeModule, DaoModule],
    }).compile()

    controller = module.get<DaoController>(DaoController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
// //
