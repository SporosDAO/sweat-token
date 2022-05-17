import { toDTO } from '@app/runtime/util'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { CreateProjectDto, ProjectDto, ProjectQueryDto } from './project.dto'
import { Project, ProjectDocument } from './project.schema'

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  toDto(doc: ProjectDocument): ProjectDto {
    return toDTO<ProjectDto>(doc)
  }

  async create(projectDto: CreateProjectDto): Promise<ProjectDto> {
    const project = new this.projectModel(projectDto)
    await project.save()
    return this.toDto(project)
  }

  async read(projectId: string): Promise<ProjectDto> {
    const project = await this.projectModel.findOne({ projectId }).exec()
    return project ? this.toDto(project) : null
  }

  async update(projectDto: ProjectDto): Promise<ProjectDto> {
    if (!projectDto) throw new BadRequestException()
    const { projectId } = projectDto
    if (projectId) throw new BadRequestException()
    const project = await this.read(projectDto.projectId)
    if (!project) throw new NotFoundException()

    const updates = {
      ...project,
      ...projectDto,
    }

    const res = await this.projectModel.updateOne({ projectId }, updates)
    if (!res.matchedCount) throw new NotFoundException()

    return await this.read(projectId)
  }

  async delete(projectId: string): Promise<void> {
    await this.projectModel.deleteOne({ projectId }).exec()
  }

  async find(query: ProjectQueryDto): Promise<ProjectDto[]> {
    const q: FilterQuery<ProjectDocument> = {}

    if (query.ownerId) q.ownerId = query.ownerId
    if (query.daoId) q.daoId = query.daoId

    const dateField = query.dateField || 'created'

    if (query.from) {
      q[dateField] = {
        $gte: query.from,
      }
    }
    if (query.to) {
      q[dateField] = q[dateField] || {}
      q[dateField].$lte = query.to
    }

    const find = this.projectModel.find(q)

    if (query.limit) find.limit(query.limit)
    if (query.skip) find.skip(query.limit)

    const res = await find.exec()
    return res.map((doc) => this.toDto(doc))
  }
}
