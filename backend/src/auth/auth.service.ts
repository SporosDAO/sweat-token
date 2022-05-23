import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtTokenDto, UserDto } from 'src/user/user.dto'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'
import { NonceDto } from './auth.dto'
import { ethers } from 'ethers'
import { randomString } from '@app/runtime/util'

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async validateUser(userId: string): Promise<UserDto> {
    const user = await this.usersService.load({ userId })
    return user
  }

  async verifySignature({ userId, nonce, signature }: NonceDto): Promise<JwtTokenDto> {
    if (!userId || !nonce || !signature) throw new BadRequestException()
    const user = await this.usersService.load({ userId, nonce })
    if (!user) throw new NotFoundException()

    const messageAddress = ethers.utils.verifyMessage(nonce, signature)
    if (messageAddress.toLowerCase() !== user.publicAddress) throw new UnauthorizedException()

    await this.usersService.update(userId, { ...user, nonce: randomString() })

    return {
      token: this.jwtService.sign({ ...user, sub: userId }),
    }
  }

  async getUserByAddress(publicAddress: string): Promise<NonceDto> {
    if (!publicAddress) throw new BadRequestException()

    let user = await this.usersService.load({ publicAddress })

    const nonce = randomString()
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
    } else {
      user.nonce = nonce
      await this.usersService.update(userId, user)
    }

    return { nonce, userId }
  }
}
