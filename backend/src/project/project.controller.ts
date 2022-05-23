import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/auth.decorator'
import { Roles } from 'src/auth/auth.roles.decorator'
import { RolesGuard } from 'src/auth/auth.roles.guard'
import { Role } from 'src/user/user.dto'
import { CreateProjectDto, ProjectDto, ProjectQueryDto } from './project.dto'
import { ProjectGuard } from './project.guard'
import { ProjectService } from './project.service'

@ApiTags('project')
@Controller('project')
@UseGuards(ProjectGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('find')
  @HttpCode(200)
  find(@Body() query: ProjectQueryDto): Promise<ProjectDto[]> {
    return this.projectService.find(query)
  }

  @Post()
  @HttpCode(200)
  @Auth(Role.projectManager, Role.founder)
  create(@Body() project: CreateProjectDto): Promise<ProjectDto> {
    return this.projectService.create(project)
  }

  @Get(':projectId')
  @HttpCode(200)
  read(@Param('projectId') projectId: string): Promise<ProjectDto> {
    const p = this.projectService.read(projectId)
    if (!p) throw new NotFoundException()
    return p
  }

  @Put(':projectId')
  @HttpCode(200)
  @Auth(Role.projectManager, Role.founder)
  update(@Param('projectId') projectId: string, @Body() projectDto: ProjectDto): Promise<ProjectDto> {
    projectDto.projectId = projectId
    return this.projectService.update(projectDto)
  }

  @Delete(':projectId')
  @HttpCode(200)
  @Auth(Role.projectManager, Role.founder)
  delete(@Param('projectId') projectId: string): Promise<void> {
    return this.projectService.delete(projectId)
  }
}
