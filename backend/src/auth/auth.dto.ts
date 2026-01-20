import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class NonceDto {
  @ApiProperty()
  @IsString()
  nonce: string
  @ApiProperty()
  @IsUUID()
  userId: string
  @ApiPropertyOptional()
  @IsString()
  signature?: string
}
