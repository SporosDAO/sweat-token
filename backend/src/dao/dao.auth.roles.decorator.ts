import { SetMetadata } from '@nestjs/common'
import { Role } from 'src/user/user.dto'

export const DAO_ROLES_KEY = 'dao_roles'
export const DaoRoles = (...roles: Role[]) => SetMetadata(DAO_ROLES_KEY, roles)
