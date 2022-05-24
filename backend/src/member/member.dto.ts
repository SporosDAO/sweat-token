import { RecordEventType } from '@app/runtime/event.dto'
import { ApiHideProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'
import { Role } from 'src/user/user.dto'

export enum MemberStatus {
  enabled = 'enabled',
  disabled = 'disabled',
  invited = 'invited',
  pending = 'pending',
  accepted = 'accepted',
  cancelled = 'cancelled',
}

export interface MemberEvent {
  daoId: string
  userId: string
  memberId: string
  type: RecordEventType
}

export class MemberQueryDto {
  @IsUUID()
  @IsOptional()
  daoId?: string
  @IsUUID()
  @IsOptional()
  userId?: string
  @IsUUID()
  @IsOptional()
  memberId?: string
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
  @IsEnum(MemberStatus)
  status?: MemberStatus
}

export class MemberInviteDto {
  @IsNotEmpty()
  @IsUUID()
  daoId: string

  @IsArray()
  @IsOptional()
  projectId?: string[]

  @IsArray()
  @IsOptional()
  roles?: string[]

  @IsString()
  @IsNotEmpty()
  publicAddress: string
}

export class MemberDto {
  @IsNotEmpty()
  @IsUUID()
  memberId: string

  @IsNotEmpty()
  @IsUUID()
  userId: string

  @IsNotEmpty()
  @IsUUID()
  daoId: string

  @IsOptional()
  invitation: string

  @IsOptional()
  roles: Role[] | string[]

  @IsOptional()
  status: MemberStatus = MemberStatus.pending
}

export class CreateMemberDto extends PartialType(MemberDto) {
  @ApiHideProperty()
  @IsOptional()
  memberId?: string

  @IsNotEmpty()
  @IsUUID()
  userId: string

  @IsNotEmpty()
  @IsUUID()
  daoId: string

  @ApiHideProperty()
  @IsOptional()
  invitation?: string

  @IsArray()
  @IsOptional()
  roles?: Role[] | string[]
}

export class UpdateMemberDto extends CreateMemberDto {}
