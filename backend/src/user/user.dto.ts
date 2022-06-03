import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsAlphanumeric,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export enum Role {
  admin = 'admin',
  founder = 'founder',
  projectManager = 'projectManager',
  mentor = 'mentor',
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
  name?: string

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

export class CreateUserDto extends UserDto {
  @IsAlphanumeric()
  @IsNotEmpty()
  publicAddress: string
}

export class JwtTokenDto {
  token: string
}

export class UserQueryDto {
  @IsArray()
  userId?: string[]

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNumber()
  limit?: number

  @IsOptional()
  @IsNumber()
  skip?: number
}
