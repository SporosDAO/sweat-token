import { RecordEventType } from '@app/runtime/event.dto'
import { ApiHideProperty, PartialType } from '@nestjs/swagger'
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'
import { ContactHandle, Role } from 'src/user/user.dto'

export enum Skill {
  'Mentor' = 'Mentor',
  'Software Engineer' = 'Software Engineer',
  'UX/Designer' = 'UX/Designer',
  'Legal' = 'Legal',
  'Operations' = 'Operations',
  'Finance' = 'Finance',
  'Policy' = 'Policy',
}

export enum MemberStatus {
  enabled = 'enabled',
  disabled = 'disabled',
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

  @IsString()
  @IsOptional()
  match?: string

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
  @IsOptional()
  @IsEnum(Skill)
  skills?: Skill[]
}

export class MemberInviteDto {
  @IsNotEmpty()
  @IsUUID()
  daoId: string

  @IsOptional()
  @IsUUID()
  invitedBy: string

  @IsArray()
  @IsOptional()
  projectId?: string[]

  @IsArray()
  @IsOptional()
  roles?: Role[]

  @IsString()
  @IsNotEmpty()
  publicAddress: string

  @IsString()
  @IsOptional()
  name?: string
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
  roles: Role[]

  @IsOptional()
  status: MemberStatus = MemberStatus.pending

  @IsOptional()
  @IsArray()
  skills?: Skill[]

  @IsUUID()
  invitedBy: string
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
  roles?: Role[]

  @IsOptional()
  invitedBy: string
}

export class UpdateMemberDto extends CreateMemberDto {}

export class ExtendedMemberDto extends MemberDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  publicAddress: string

  @IsOptional()
  @IsArray()
  contacts?: ContactHandle[]
}
