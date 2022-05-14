import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtTokenDto, UserDto } from './user.dto'
import { UsersService } from './users.service'
import { v4 as uuidv4 } from 'uuid'
import { NonceDto } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(userId: string): Promise<UserDto> {
    const user = await this.usersService.load(userId)
    return user
  }

  async getNonce(publicAddress: string): Promise<NonceDto> {
    if (!publicAddress) throw new BadRequestException()

    let user = await this.usersService.load(publicAddress)

    const nonce = uuidv4()
    const userId = user ? user.userId : uuidv4()

    if (!user) {
      user = await this.usersService.create({
        publicAddress,
        userId,
        nonce,
        roles: [],
        name: undefined,
        created: new Date(),
      })
    }

    await this.usersService.update(userId, user)

    return { nonce, userId }
  }

  async login(user: UserDto): Promise<JwtTokenDto> {
    const payload = { userId: user.userId, sub: user.userId }
    return {
      token: this.jwtService.sign(payload),
    }
  }
}
