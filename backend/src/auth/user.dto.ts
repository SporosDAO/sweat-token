import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty()
  userId: string
  @ApiProperty()
  name: string
}

export class JwtTokenDto {
  @ApiProperty()
  token: string
}
