import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role, UserDto } from 'src/user/user.dto'
import { ROLES_KEY } from './auth.roles.decorator'

export const checkUserRoles = (user: UserDto, requiredRoles: Role[]): boolean => {
  if (!requiredRoles || !requiredRoles.length) return true
  if (!user) return false
  if (user.roles?.includes(Role.admin)) return true

  const hasRole = requiredRoles.some((role) => user.roles?.includes(role))
  return hasRole
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    return checkUserRoles(user, requiredRoles)
  }
}
