import { ApiProperty } from '@nestjs/swagger'
import { IsAlphanumeric, IsArray, IsDate, IsEnum, IsUUID } from 'class-validator'

export enum Role {
  admin = 'admin',
  founder = 'founder',
  contributor = 'contributor',
}

export class UserDto {
  @IsUUID()
  userId: string
  @IsAlphanumeric()
  name: string
  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsEnum(Role)
  roles: Role[]
  @IsAlphanumeric()
  publicAddress: string
  @IsAlphanumeric()
  nonce: string
  @IsDate()
  created: Date
}

export class JwtTokenDto {
  token: string
}
