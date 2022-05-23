import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { User } from 'src/user/user.schema'
import { ProjectService } from './project.service'

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(private reflector: Reflector, private projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request

    const user = req.user ? (req.user as User) : null
    if (!user) return true

    const { projectId } = req.params
    if (!projectId) return true

    const project = await this.projectService.read(projectId)
    if (!project) return true

    if (user.userId !== project.ownerId) {
      return false
    }

    return true
  }
}
