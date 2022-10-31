import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { CommitmentType, PaymentPeriod, TaskStatus } from './task.dto'

@Schema()
export class Task {
  @Prop({
    default: () => uuidv4(),
    required: true,
    unique: true,
  })
  taskId: string

  @Prop({
    required: true,
  })
  daoId: string

  @Prop({
    required: true,
  })
  projectId: string

  @Prop({
    required: true,
  })
  name: string

  @Prop({
    required: false,
  })
  description?: string

  @Prop({
    required: true,
    default: () => new Date(),
  })
  created: Date

  @Prop({
    required: true,
  })
  ownerId: string

  @Prop({
    required: true,
    type: String,
  })
  status: TaskStatus

  @Prop({
    required: false,
    type: String,
  })
  contributorId?: string

  @Prop({
    required: true,
  })
  skills?: string[]

  @Prop({
    type: String,
    required: true,
  })
  type?: CommitmentType

  @Prop({
    required: false,
  })
  budget: number

  @Prop({
    type: String,
    enum: PaymentPeriod,
    required: false,
    default: () => PaymentPeriod.monthly,
  })
  period: PaymentPeriod = PaymentPeriod.monthly

  @Prop({
    required: false,
  })
  deadline?: Date

  @Prop({
    required: false,
    default: () => [2, 6],
  })
  bands?: [number, number]
}

export type TaskDocument = Task & Document
export const TaskSchema = SchemaFactory.createForClass(Task)
