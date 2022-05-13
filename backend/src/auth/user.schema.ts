import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

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
}

export const UserSchema = SchemaFactory.createForClass(User)
