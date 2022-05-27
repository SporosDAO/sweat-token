import { randomString } from '@app/runtime/util'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Role } from 'src/user/user.dto'
import { v4 as uuidv4 } from 'uuid'
import { MemberStatus } from './member.dto'

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
    required: false,
  })
  invitation?: string

  @Prop({
    required: false,
    type: [String],
    default: () => [],
  })
  roles?: Role[]

  @Prop({
    required: false,
    default: () => [],
    type: [String],
  })
  projects?: string[]

  @Prop({
    required: false,
    type: [String],
  })
  status?: MemberStatus
}

export const MemberSchema = SchemaFactory.createForClass(Member)
