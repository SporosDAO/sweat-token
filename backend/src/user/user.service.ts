import { toDTO } from '@app/runtime/util'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDto } from './user.dto'
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

  async create(userDto: UserDto): Promise<User> {
    const user = new this.userModel(userDto)
    return this.toDTO(await user.save())
  }

  async update(userId: string, userDto: UserDto): Promise<User> {
    if (!userId) throw new BadRequestException()
    userDto.userId = userId
    const res = await this.userModel.updateOne({ userId }, userDto).exec()
    if (!res.matchedCount) throw new NotFoundException()
    return userDto
  }
}
