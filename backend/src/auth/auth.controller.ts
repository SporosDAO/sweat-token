import { Body, Controller, Get, HttpCode, Post, Query, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { NonceDto } from './auth.dto'
import { JwtAuthGuard } from './auth.jwt.guard'
import { AuthService } from './auth.service'
import { JwtTokenDto, UserDto } from 'src/user/user.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('user')
  @HttpCode(200)
  getUser(@Query('publicAddress') publicAddress: string): Promise<NonceDto> {
    return this.authService.getUserByAddress(publicAddress)
  }

  @Post('user')
  @HttpCode(200)
  verifySignature(@Body() sig: NonceDto): Promise<JwtTokenDto> {
    return this.authService.verifySignature(sig)
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req): UserDto {
    return req.user
  }
}
