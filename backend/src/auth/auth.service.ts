import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtTokenDto, UserDto } from 'src/user/user.dto'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'
import { NonceDto } from './auth.dto'
import { ethers } from 'ethers'
import { randomString } from '@app/runtime/util'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(userId: string): Promise<UserDto> {
    const user = await this.usersService.load({ userId })
    return user
  }

  async verifySignature({ userId, nonce, signature }: NonceDto): Promise<JwtTokenDto> {
    if (!userId || !nonce || !signature) throw new BadRequestException()
    const user = await this.usersService.load({ userId, nonce })
    if (!user) throw new NotFoundException()

    const messageAddress = ethers.utils.verifyMessage(nonce, signature)
    if (messageAddress !== user.publicAddress) {
      this.logger.log(`publicAddress not matching signature: ${messageAddress.toLowerCase()}`)
      throw new UnauthorizedException()
    }

    await this.usersService.update(userId, { ...user, nonce: randomString() })

    return {
      token: this.jwtService.sign(
        { ...user, sub: userId },
        {
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        },
      ),
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
