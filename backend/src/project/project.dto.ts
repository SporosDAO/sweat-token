import { RecordEventType } from '@app/runtime/event.dto'
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export interface ProjectEvent {
  projectId: string
  daoId: string
  type: RecordEventType
}

export enum ProjectStatus {
  open = 'open',
  closed = 'closed',
  disabled = 'disabled',
}

export class ProjectQueryDto {
  daoId?: string
  ownerId?: string
  dateField?: string = 'created'
  from?: Date
  to?: Date
  limit?: number
  skip?: number
  status?: ProjectStatus
}

export class ProjectDto {
  projectId: string

  @IsNotEmpty()
  name: string

  description: string

  @IsNotEmpty()
  @IsDate()
  deadline: Date

  @IsNotEmpty()
  @IsNumber()
  budget: number

  @IsOptional()
  @IsNumber()
  budgetAllocation: number

  proposalId: string
  ownerId: string
  @IsNotEmpty()
  daoId: string
  created: Date
  status: ProjectStatus
}

export class CreateProjectDto {
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  deadline: Date
  @IsNotEmpty()
  budget: number
  @IsNotEmpty()
  daoId: string
  @IsNotEmpty()
  ownerId: string
}
