import { RecordEventType } from '@app/runtime/event.dto'
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsUUID } from 'class-validator'

export interface TaskEvent {
  taskId: string
  projectId: string
  daoId: string
  type: RecordEventType
}

export enum PaymentPeriod {
  monthly = 'monthly',
  weekly = 'weekly',
  daily = 'daily',
}

export enum CommitmentType {
  ongoing = 'ongoing',
  onetime = 'onetime',
}

export enum TaskStatus {
  open = 'open',
  closed = 'closed',
  cancelled = 'cancelled',
  dispute = 'dispute',
}

export class TaskQueryDto {
  @IsUUID()
  @IsOptional()
  daoId?: string
  @IsUUID()
  @IsOptional()
  ownerId?: string
  @IsUUID()
  @IsOptional()
  projectId?: string
  @IsOptional()
  dateField?: string = 'created'
  @IsOptional()
  from?: Date
  @IsOptional()
  to?: Date
  @IsOptional()
  @IsNumber()
  limit?: number
  @IsOptional()
  @IsNumber()
  skip?: number
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus
}

export class TaskDto {
  @IsNotEmpty()
  daoId: string

  @IsNotEmpty()
  projectId: string

  @IsNotEmpty()
  taskId: string

  @IsNotEmpty()
  name: string

  description?: string

  @IsNotEmpty()
  deadline: Date

  @IsNotEmpty()
  @IsNumberString()
  budget: number

  @IsUUID()
  ownerId: string

  @IsUUID()
  @IsOptional()
  contributorId?: string

  @IsDate()
  @IsOptional()
  created: Date

  @IsEnum(TaskStatus)
  status: TaskStatus

  @IsArray()
  skills: string[]

  @IsArray()
  @IsOptional()
  bands?: number[]

  @IsEnum(CommitmentType)
  type: CommitmentType

  @IsEnum(PaymentPeriod)
  @IsOptional()
  period?: PaymentPeriod = PaymentPeriod.monthly
}

export class CreateTaskDto extends TaskDto {
  @IsOptional()
  taskId: string

  @IsOptional()
  status: TaskStatus

  @IsOptional()
  created: Date

  @IsOptional()
  skills: string[]

  @IsOptional()
  deadline: Date
}

export class UpdateTaskDto {
  @IsUUID()
  @IsOptional()
  taskId?: string

  @IsUUID()
  @IsOptional()
  contributorId?: string

  @IsOptional()
  @IsArray()
  skills?: string[]

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus
}
