import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DaoProposalNotificationDocument = DaoProposalNotification & Document

@Schema()
export class DaoProposalNotification {
  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  proposalId: string

  @Prop({
    index: true,
    required: true,
  })
  daoId: string

  @Prop({
    required: true,
  })
  message: string

  @Prop({
    required: true,
  })
  quorum: number

  @Prop({
    required: true,
  })
  deadline: Date

  @Prop({
    required: true,
    default: () => new Date(),
  })
  created: Date

  @Prop({
    required: false,
  })
  sent?: Date
}

export const DaoProposalNotificationSchema = SchemaFactory.createForClass(DaoProposalNotification)
