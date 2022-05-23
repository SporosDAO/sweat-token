import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import { UserModule } from './user.module'
import { UserService } from './user.service'

describe('UsersService', () => {
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RuntimeModule, UserModule],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
