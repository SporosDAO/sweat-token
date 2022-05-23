import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsAlphanumeric, IsArray, IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator'

export enum Role {
  admin = 'admin',
  founder = 'founder',
  projectManager = 'projectManager',
}

export class ContactHandle {
  @ApiProperty()
  type: 'twitter' | 'discord' | 'email'
  @ApiProperty()
  value: string
}

export class UserDto {
  @IsUUID()
  userId: string

  @IsAlphanumeric()
  name: string

  @ApiPropertyOptional({
    type: [String],
  })
  @IsArray()
  @IsEnum(Role)
  @IsOptional()
  roles?: Role[]

  @IsAlphanumeric()
  publicAddress: string

  @IsAlphanumeric()
  nonce: string

  @IsDate()
  created: Date

  @IsOptional()
  contacts?: ContactHandle[]
}

export class JwtTokenDto {
  token: string
}
