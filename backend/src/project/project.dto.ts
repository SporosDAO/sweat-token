import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

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
  deadline: Date
  @IsNotEmpty()
  budget: number
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
}
