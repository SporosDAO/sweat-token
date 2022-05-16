import { ApiProperty } from '@nestjs/swagger'

export enum Role {
  admin = 'admin',
  founder = 'founder',
  contributor = 'contributor',
}

export class UserDto {
  @ApiProperty()
  userId: string
  @ApiProperty()
  name: string
  @ApiProperty()
  roles: Role[]
  @ApiProperty()
  publicAddress: string
  @ApiProperty()
  nonce: string
  @ApiProperty()
  created: Date
}

export class JwtTokenDto {
  @ApiProperty()
  token: string
}
