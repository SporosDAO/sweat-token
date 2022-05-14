import { Body, Controller, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './auth.jwt.guard'
import { LocalAuthGuard } from './local-auth.guard'
import { JwtTokenDto, UserDto } from './user.dto'
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse()
  getProfile(@Request() req): UserDto {
    return req.user
  }
}
