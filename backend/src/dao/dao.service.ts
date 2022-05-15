import { toDTO } from '@app/runtime/util'
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DaoDto } from './dao.dto'
import { Dao, DaoDocument } from './dao.schema'

@Injectable()
export class DaoService implements OnModuleInit {
  private readonly logger = new Logger(DaoService.name)
  constructor(@InjectModel(Dao.name) private daoModel: Model<DaoDocument>) {}

  async onModuleInit() {
    this.logger.warn(`Adding sample DAO`)
    if ((await this.list()).length === 0) {
      const dao = new this.daoModel({
        name: 'SporosDAO',
      } as DaoDto)
      await dao.save()
    }
  }

  toDto(dao: DaoDocument): DaoDto {
    return toDTO<DaoDto>(dao)
  }

  async list(): Promise<DaoDto[]> {
    const q = this.daoModel.find()
    const res = await q.exec()
    return res.map((dao) => this.toDto(dao))
  }

  async load(daoId: string): Promise<DaoDto | null> {
    const dao = await this.daoModel.findOne({ daoId }).exec()
    if (!dao) throw new NotFoundException()
    return this.toDto(dao)
  }
}
