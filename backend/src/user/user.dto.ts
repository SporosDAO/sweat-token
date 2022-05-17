import { ApiProperty } from '@nestjs/swagger'

export enum Role {
  admin = 'admin',
  founder = 'founder',
  contributor = 'contributor',
}

export class UserDto {
  userId: string
  name: string
  @ApiProperty({
    type: [String],
  })
  roles: Role[]
  publicAddress: string
  nonce: string
  created: Date
}

export class JwtTokenDto {
  token: string
}
