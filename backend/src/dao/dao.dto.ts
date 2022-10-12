import { RecordEventType } from '@app/runtime/event.dto'
import { IsAlphanumeric, IsBoolean, IsNotEmpty, IsOptional, IsUrl, IsUUID } from 'class-validator'

export interface DaoEvent {
  daoId: string
  ownerId: string
  type: RecordEventType
}

export class DaoDto {
  @IsUUID()
  daoId: string
  @IsNotEmpty()
  name: string
  @IsOptional()
  mission: string
  @IsUrl()
  @IsOptional()
  website: string
  @IsUrl()
  @IsOptional()
  logo: string
  @IsAlphanumeric()
  kaliAddress: string
  @IsBoolean()
  isPrivate: boolean
  @IsOptional()
  created: Date
  @IsOptional()
  @IsUUID()
  createdBy: string
}

export class CreateDaoDto extends DaoDto {
  @IsOptional()
  daoId: string
  @IsOptional()
  isPrivate: boolean
}
