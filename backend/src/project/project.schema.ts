import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { ProjectStatus } from './project.dto'

export type ProjectDocument = Project & Document

@Schema()
export class Project {
  @Prop({
    default: () => uuidv4(),
    unique: true,
  })
  projectId: string

  @Prop({
    required: false,
  })
  name: string

  @Prop({
    required: false,
  })
  description: string

  @Prop({
    required: true,
    default: () => new Date(),
  })
  created: Date

  @Prop({
    required: false,
  })
  deadline?: Date

  @Prop({
    required: false,
  })
  proposalId?: string

  @Prop({
    required: true,
  })
  ownerId: string

  @Prop({
    required: true,
  })
  daoId: string

  @Prop({
    required: true,
    type: String,
  })
  status: ProjectStatus
}

export const ProjectSchema = SchemaFactory.createForClass(Project)
