import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateProjectDto, ProjectDto, ProjectQueryDto } from './project.dto'
import { ProjectService } from './project.service'

@ApiBearerAuth()
@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post('find')
  @HttpCode(200)
  find(@Body() query: ProjectQueryDto): Promise<ProjectDto[]> {
    return this.projectService.find(query)
  }

  @Post()
  @HttpCode(200)
  create(@Body() project: CreateProjectDto): Promise<ProjectDto> {
    return this.projectService.create(project)
  }

  @Get(':projectId')
  @HttpCode(200)
  read(@Param('projectId') projectId: string): Promise<ProjectDto> {
    return this.projectService.read(projectId)
  }

  @Put(':projectId')
  @HttpCode(200)
  update(@Param('projectId') projectId: string, @Body() projectDto: ProjectDto): Promise<ProjectDto> {
    projectDto.projectId = projectId
    return this.projectService.update(projectDto)
  }

  @Delete(':projectId')
  @HttpCode(200)
  delete(@Param('projectId') projectId: string): Promise<void> {
    return this.projectService.delete(projectId)
  }
}
