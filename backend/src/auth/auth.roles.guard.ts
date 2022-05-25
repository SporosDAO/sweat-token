import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from 'src/user/user.dto'
import { ROLES_KEY } from './auth.roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {

  private readonly logger = new Logger(RolesGuard.name)

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()

    this.logger.debug({requiredRoles})
    this.logger.debug({user})

    if (user.roles.includes(Role.admin)) return true
    return requiredRoles.some((role) => user.roles?.includes(role))
  }
}
