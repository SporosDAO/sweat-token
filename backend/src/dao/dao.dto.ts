import { ApiProperty } from '@nestjs/swagger'

export class DaoDto {
  @ApiProperty()
  daoId: string
  @ApiProperty()
  name: string
}
