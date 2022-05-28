import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/auth.decorator'
import { Roles } from 'src/auth/auth.roles.decorator'
import { RolesGuard } from 'src/auth/auth.roles.guard'
import { Role } from 'src/user/user.dto'
import { CreateMemberDto, MemberDto, MemberQueryDto } from './member.dto'
import { MemberService } from './member.service'

@ApiBearerAuth()
@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('find')
  @HttpCode(200)
  find(@Body() query: MemberQueryDto): Promise<MemberDto[]> {
    return this.memberService.find(query)
  }

  @Post()
  @HttpCode(200)
  @Auth(Role.founder)
  create(@Body() member: CreateMemberDto): Promise<MemberDto> {
    return this.memberService.create(member)
  }

  @Get(':memberId')
  @HttpCode(200)
  read(@Param('memberId') memberId: string): Promise<MemberDto> {
    return this.memberService.read(memberId)
  }

  @Put(':memberId')
  @HttpCode(200)
  @Auth(Role.founder)
  update(@Param('memberId') memberId: string, @Body() memberDto: MemberDto): Promise<MemberDto> {
    memberDto.memberId = memberId
    return this.memberService.update(memberDto)
  }

  @Delete(':memberId')
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Auth(Role.founder)
  delete(@Param('memberId') memberId: string): Promise<void> {
    return this.memberService.delete(memberId)
  }
}
