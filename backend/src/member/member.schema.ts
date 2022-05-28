import { randomString } from '@app/runtime/util'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Role } from 'src/user/user.dto'
import { v4 as uuidv4 } from 'uuid'

export type MemberDocument = Member & Document

@Schema()
export class Member {
  @Prop({
    default: () => uuidv4(),
    required: true,
  })
  memberId: string

  @Prop({
    required: true,
  })
  userId: string

  @Prop({
    required: false,
  })
  daoId: string

  @Prop({
    default: () => randomString(),
    required: false,
  })
  invitation?: string

  @Prop({
    required: false,
    type: [String],
  })
  roles?: Role[]

  @Prop({
    required: false,
    type: [String],
  })
  projects?: string[]
}

export const MemberSchema = SchemaFactory.createForClass(Member)
