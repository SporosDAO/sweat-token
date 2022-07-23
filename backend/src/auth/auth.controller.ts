import { BadRequestException, Body, Controller, Get, HttpCode, Post, Query, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { NoncePayloadDto, SiwePayloadDto } from './auth.dto'
import { JwtAuthGuard } from './auth.jwt.guard'
import { AuthService } from './auth.service'
import { JwtTokenDto, UserDto } from 'src/user/user.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('user')
  @HttpCode(200)
  getUser(@Query('chainId') chainId: string, @Query('publicAddress') publicAddress: string): Promise<NoncePayloadDto> {
    if (!chainId || !publicAddress) throw new BadRequestException()
    return this.authService.getUserByAddress(chainId, publicAddress)
  }

  @Post('user')
  @HttpCode(200)
  verifySignature(@Body() sig: SiwePayloadDto): Promise<JwtTokenDto> {
    return this.authService.verifySignature(sig)
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): UserDto {
    return req.user
  }
}
