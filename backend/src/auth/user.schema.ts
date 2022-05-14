import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { Role } from './user.dto'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({
    default: () => uuidv4(),
    unique: true,
  })
  userId: string

  @Prop({
    required: false,
  })
  name: string

  @Prop({
    type: String,
    required: false,
  })
  roles: Role[]
}

export const UserSchema = SchemaFactory.createForClass(User)
