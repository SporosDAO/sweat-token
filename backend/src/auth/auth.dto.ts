import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class NonceDto {
  @ApiProperty()
  nonce: string
  @ApiProperty()
  userId: string
  @ApiPropertyOptional()
  signedId?: Date
  @ApiPropertyOptional()
  signature?: string
}
