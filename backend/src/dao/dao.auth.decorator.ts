import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/auth.jwt.guard'
import { Role } from 'src/user/user.dto'
import { DaoRoles } from './dao.auth.roles.decorator'
import { DaoRolesGuard } from './dao.auth.roles.guard'

export function DaoAuth(...roles: Role[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, DaoRolesGuard),
    DaoRoles(...roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  )
}
//
