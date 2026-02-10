import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'src/auth/auth.roles.decorator'
import { checkUserRoles } from 'src/auth/auth.roles.guard'
import { MemberDto } from 'src/member/member.dto'
import { MemberService } from 'src/member/member.service'
import { Role, UserDto } from 'src/user/user.dto'
import { DAO_ROLES_KEY } from './dao.auth.roles.decorator'
import { DaoDto } from './dao.dto'
import { DaoService } from './dao.service'

@Injectable()
export class DaoRolesGuard implements CanActivate {
  constructor(private daoService: DaoService, private memberService: MemberService, private reflector: Reflector) {}

  checkUserRoles(user: UserDto, context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles || !requiredRoles.length) return false
    return checkUserRoles(user, requiredRoles)
  }

  checkDaoRoles(user: { roles: Role[] }, requiredDaoRoles: Role[]): boolean {
    if (user.roles?.includes(Role.admin)) return true
    const hasRole = requiredDaoRoles.some((role) => user.roles?.includes(role))
    return hasRole
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { user, params } = req

    if (!user) return false

    const hasAdminRoles = this.checkUserRoles(user, context)
    if (hasAdminRoles) return true

    const requiredDaoRoles = this.reflector.getAllAndOverride<Role[]>(DAO_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredDaoRoles || !requiredDaoRoles.length) return true

    if (!params) return false

    if (!params.daoId) return false

    const dao = await this.daoService.load({
      daoId: params.daoId,
    })
    if (!dao) return false

    const member = await this.memberService.load({
      userId: user.userId,
      daoId: params.daoId,
    })
    if (!member) return false

    const hasRoles = this.checkDaoRoles(member, requiredDaoRoles)
    if (!hasRoles) return false

    // store in req context
    req.member = member
    req.dao = dao

    return true
  }
}
