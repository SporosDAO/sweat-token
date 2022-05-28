import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import { MemberModule } from './member.module'
import { MemberService } from './member.service'

describe('MemberService', () => {
  let service: MemberService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RuntimeModule, MemberModule],
    }).compile()

    service = module.get<MemberService>(MemberService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
