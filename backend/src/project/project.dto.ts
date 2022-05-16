export enum ProjectStatus {
  open = 'open',
  closed = 'closed',
  disabled = 'disabled',
}

export class ProjectQueryDto {
  daoId?: string
  ownerId?: string
  dateField?: 'created' | 'deadline' = 'created'
  from?: Date
  to?: Date
  limit?: number
  skip?: number
  status?: ProjectStatus
}

export class ProjectDto {
  projectId: string
  name: string
  description: string
  deadline: Date
  budget: number
  proposalId: string
  ownerId: string
  daoId: string
  created: Date
  status: ProjectStatus
}
