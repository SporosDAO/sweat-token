import { toDTO } from '@app/runtime/util'
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto, UserDto } from './user.dto'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  toDTO(user: UserDocument): UserDto {
    return toDTO<UserDto>(user)
  }

  async load(params: Partial<UserDto>): Promise<UserDto | null> {
    if (!Object.keys(params).length) throw new BadRequestException()
    const user = await this.userModel.findOne(params)
    return user ? this.toDTO(user) : null
  }

  async create(userDto: CreateUserDto): Promise<UserDto> {
    if (!userDto.publicAddress || userDto.publicAddress.length < 10)
      throw new BadRequestException('Missing publicAddress')

    userDto.publicAddress =
      userDto.publicAddress.substring(0, 2) !== '0x' ? `0x${userDto.publicAddress}` : userDto.publicAddress

    const userExists = await this.load({ publicAddress: userDto.publicAddress })
    if (userExists) {
      throw new ConflictException(`Public key already exists`)
    }

    const user = new this.userModel(userDto)
    return this.toDTO(await user.save())
  }

  async update(userId: string, userDto: UserDto): Promise<UserDto> {
    if (!userId) throw new BadRequestException()
    userDto.userId = userId
    const res = await this.userModel.updateOne({ userId }, userDto).exec()
    if (!res.matchedCount) throw new NotFoundException()
    return userDto
  }
}
