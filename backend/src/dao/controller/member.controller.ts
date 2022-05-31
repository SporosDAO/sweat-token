import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/auth.decorator'
import { RolesGuard } from 'src/auth/auth.roles.guard'
import { User } from 'src/auth/user.decorator'
import { DaoAuth } from 'src/dao/dao.auth.decorator'
import { Role } from 'src/user/user.dto'
import { CreateMemberDto, ExtendedMemberDto, MemberDto, MemberInviteDto, MemberQueryDto } from '../../member/member.dto'
import { MemberService } from '../../member/member.service'

@ApiBearerAuth()
@ApiTags('member')
@Controller('/dao/:daoId/member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Post('list')
  @HttpCode(200)
  @DaoAuth(Role.founder, Role.projectManager)
  list(@Param('daoId') daoId: string, @Body() query: MemberQueryDto): Promise<ExtendedMemberDto[]> {
    query.daoId = daoId
    return this.memberService.list(query)
  }

  @Post('invite')
  @HttpCode(200)
  @DaoAuth(Role.founder, Role.projectManager)
  invite(
    @Param('daoId') daoId: string,
    @User('userId') userId: string,
    @Body() invite: MemberInviteDto,
  ): Promise<MemberDto> {
    invite.daoId = invite.daoId
    invite.invitedBy = userId
    return this.memberService.invite(invite)
  }

  @Post('find')
  @HttpCode(200)
  find(@Param('daoId') daoId: string, @Body() query: MemberQueryDto): Promise<MemberDto[]> {
    return this.memberService.find(query)
  }

  @Post()
  @HttpCode(200)
  @DaoAuth(Role.admin)
  create(@Param('daoId') daoId: string, @Body() member: CreateMemberDto): Promise<MemberDto> {
    return this.memberService.create(member)
  }

  @Get(':memberId')
  @HttpCode(200)
  @DaoAuth(Role.admin)
  read(@Param('daoId') daoId: string, @Param('memberId') memberId: string): Promise<MemberDto> {
    return this.memberService.read(memberId)
  }

  @Put(':memberId')
  @HttpCode(200)
  @DaoAuth(Role.admin)
  update(
    @Param('daoId') daoId: string,
    @Param('memberId') memberId: string,
    @Body() memberDto: MemberDto,
  ): Promise<MemberDto> {
    memberDto.memberId = memberId
    return this.memberService.update(memberDto)
  }

  @Delete(':memberId')
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @DaoAuth(Role.admin)
  delete(@Param('daoId') daoId: string, @Param('memberId') memberId: string): Promise<void> {
    return this.memberService.delete(memberId)
  }
}
