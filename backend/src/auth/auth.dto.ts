import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsObject, IsString, IsUUID } from 'class-validator'
import { SiweMessage } from 'siwe'

export class SiwePayloadDto {
  @ApiProperty({
    type: SiweMessage,
  })
  @IsObject()
  message: SiweMessage
  @ApiProperty()
  @IsUUID()
  userId: string
  @ApiPropertyOptional()
  @IsString()
  signature?: string
}

export class NoncePayloadDto {
  @ApiProperty()
  @IsString()
  nonce: string
  @ApiProperty()
  @IsUUID()
  userId: string
}
