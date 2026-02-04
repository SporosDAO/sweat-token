import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import { MemberController } from './member.controller'
import { MemberModule } from '../../member/member.module'

describe('MemberController', () => {
  let controller: MemberController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RuntimeModule, MemberModule],
    }).compile()

    controller = module.get<MemberController>(MemberController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
