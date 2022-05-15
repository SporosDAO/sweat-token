import { Body, Controller, Get, HttpCode, Post, Query, Request, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { NonceDto } from './auth.dto'
import { JwtAuthGuard } from './auth.jwt.guard'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'
import { JwtTokenDto, UserDto } from './user.dto'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: JwtTokenDto })
  async login(@Body() user: UserDto): Promise<JwtTokenDto> {
    return this.authService.login(user)
  }

  @UseGuards(LocalAuthGuard)
  @Get('nonce')
  @HttpCode(200)
  @ApiOkResponse({ type: NonceDto })
  async nonce(@Query('publicAddress') publicAddress: string): Promise<NonceDto> {
    return this.authService.getNonce(publicAddress)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse()
  getProfile(@Request() req): UserDto {
    return req.user
  }
}
