import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DaoProposalDocument = DaoProposal & Document

@Schema()
export class DaoProposal {
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
    index: true,
    required: false,
  })
  chainId?: string

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
  notified?: Date
}

export const DaoProposalSchema = SchemaFactory.createForClass(DaoProposal)
