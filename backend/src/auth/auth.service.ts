import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtTokenDto, UserDto } from './user.dto'
import { UsersService } from './users.service'

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(userId: string): Promise<UserDto> {
    const user = await this.usersService.load(userId)
    return user
  }

  async login(user: UserDto): Promise<JwtTokenDto> {
    const payload = { userId: user.userId, sub: user.userId }
    return {
      token: this.jwtService.sign(payload),
    }
  }
}
