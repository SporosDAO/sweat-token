import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/auth.decorator'
import { Role } from 'src/user/user.dto'
import { CreateProjectDto, ProjectDto, ProjectQueryDto } from '../../project/project.dto'
import { ProjectGuard } from '../../project/project.guard'
import { ProjectService } from '../../project/project.service'

@ApiTags('project')
@Controller('/dao/:daoId/project')
@UseGuards(ProjectGuard)
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('find')
  @HttpCode(200)
  find(@Param('daoId') daoId: string, @Body() query: ProjectQueryDto): Promise<ProjectDto[]> {
    return this.projectService.find(query)
  }

  @Post()
  @HttpCode(200)
  // @opny721 I am thinking anyone should be able to
  // submit an on-chain proposal for a new project.
  // If the DAO approves via vote, then that person
  // can manage the project and its tasks.
  // @Auth(Role.projectManager, Role.founder)
  create(@Param('daoId') daoId: string, @Body() project: CreateProjectDto): Promise<ProjectDto> {
    return this.projectService.create(project)
  }

  @Get(':projectId')
  @HttpCode(200)
  read(@Param('daoId') daoId: string, @Param('projectId') projectId: string): Promise<ProjectDto> {
    const p = this.projectService.read(projectId)
    if (!p) throw new NotFoundException()
    return p
  }

  @Put(':projectId')
  @HttpCode(200)
  @Auth(Role.projectManager, Role.founder)
  update(
    @Param('daoId') daoId: string,
    @Param('projectId') projectId: string,
    @Body() projectDto: ProjectDto,
  ): Promise<ProjectDto> {
    projectDto.projectId = projectId
    return this.projectService.update(projectDto)
  }

  @Delete(':projectId')
  @HttpCode(200)
  @Auth(Role.projectManager, Role.founder)
  delete(@Param('daoId') daoId: string, @Param('projectId') projectId: string): Promise<void> {
    return this.projectService.delete(projectId)
  }
}
