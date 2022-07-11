import { RecordEventType } from '@app/runtime/event.dto'
import { toDTO } from '@app/runtime/util'
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateDaoDto, DaoDto, DaoEvent } from './dao.dto'
import { Dao, DaoDocument } from './dao.schema'
import { DaoSettings, DaoSettingsDocument } from './settings/dao.settings.schema'

@Injectable()
export class DaoService {
  private readonly logger = new Logger(DaoService.name)
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(Dao.name) private daoModel: Model<DaoDocument>,
    @InjectModel(DaoSettings.name) private daoSettingsModel: Model<DaoSettingsDocument>,
  ) {}

  private emit(type: RecordEventType, dao: DaoDto | DaoDocument) {
    this.eventEmitter.emit('dao.changed', {
      daoId: dao.daoId,
      ownerId: dao.createdBy,
      type,
    } as DaoEvent)
  }

  toDto(dao: DaoDocument): DaoDto {
    return toDTO<DaoDto>(dao)
  }

  async list(): Promise<DaoDto[]> {
    const q = this.daoModel.find()
    const res = await q.exec()
    return res.map((dao) => this.toDto(dao))
  }

  async read(daoId: string): Promise<DaoDto> {
    const dao = await this.daoModel.findOne({ daoId }).exec()
    if (!dao) throw new NotFoundException()
    return this.toDto(dao)
  }

  async load(daoDto: Partial<DaoDto>): Promise<DaoDto | null> {
    if (Object.keys(daoDto).length === 0) throw new BadRequestException()
    const dao = await this.daoModel.findOne(daoDto).exec()
    return dao ? this.toDto(dao) : null
  }

  async create(daoDto: CreateDaoDto): Promise<DaoDto> {
    if (daoDto.daoId) delete daoDto.daoId
    const dao = new this.daoModel(daoDto)
    await dao.save()
    this.emit('create', dao)
    return this.toDto(dao)
  }

  async update(daoDto: DaoDto): Promise<DaoDto> {
    if (!daoDto) throw new BadRequestException()
    const { daoId } = daoDto
    if (!daoId) throw new BadRequestException()
    const dao = await this.read(daoDto.daoId)
    if (!dao) throw new NotFoundException()

    const updates = {
      ...dao,
      ...daoDto,
    }

    const res = await this.daoModel.updateOne({ daoId }, updates)
    if (!res.matchedCount) throw new NotFoundException()

    this.emit('update', dao)

    return await this.read(daoId)
  }

  async delete(daoId: string): Promise<void> {
    const dao = await this.read(daoId)
    if (!dao) return
    await this.daoModel.deleteOne({ daoId }).exec()
    this.emit('delete', dao)
  }
}
