import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDto } from './user.dto'
import { User, UserDocument } from './user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  toDTO(user: UserDocument): UserDto {
    return user.toJSON() as UserDto
  }

  async load(userId: string): Promise<User | null> {
    const user = await this.userModel.findOne({ userId })
    return user ? this.toDTO(user) : null
  }

  async create(userDto: UserDto): Promise<User> {
    const user = new this.userModel(userDto)
    return this.toDTO(await user.save())
  }
}
