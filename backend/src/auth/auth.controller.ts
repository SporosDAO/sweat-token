import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './auth.jwt.guard'
import { LocalAuthGuard } from './local-auth.guard'
import { JwtTokenDto } from './user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<JwtTokenDto> {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
