import { randomString } from '@app/runtime/util'
import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { SiweMessage } from 'siwe'
import { JwtTokenDto, UserDto } from 'src/user/user.dto'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'
import { NoncePayloadDto, SiwePayloadDto } from './auth.dto'

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

  async verifySignature({ userId, signature, message }: SiwePayloadDto): Promise<JwtTokenDto> {
    if (!userId || !signature || !message) throw new BadRequestException()

    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)

    const user = await this.usersService.load({ userId, nonce: fields.nonce })
    if (!user) {
      this.logger.log(`user not found by nonce: userId=${userId} nonce=${fields.nonce}`)
      throw new UnauthorizedException()
    }

    if (fields.nonce !== user.nonce) {
      this.logger.log(`publicAddress not matching signature: userId=${userId} nonce=${fields.nonce}`)
      throw new UnauthorizedException()
    }

    await this.usersService.update(userId, { ...user, nonce: randomString() })

    return {
      token: this.jwtService.sign(
        { ...user, sub: userId, ...fields },
        {
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        },
      ),
    }
  }

  async getUserByAddress(chainId: string, publicAddress: string): Promise<NoncePayloadDto> {
    if (!publicAddress) throw new BadRequestException()

    let user = await this.usersService.load({ publicAddress })

    const nonce = randomString()
    const userId = user ? user.userId : uuidv4()

    if (!user) {
      user = await this.usersService.create({
        publicAddress,
        chainId,
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
