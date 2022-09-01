import { toDTO } from '@app/runtime/util'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DaoSettingsDto } from './dao.settings.dto'
import { DaoSettings, DaoSettingsDocument } from './dao.settings.schema'

@Injectable()
export class DaoSettingsService {
  private readonly logger = new Logger(DaoSettingsService.name)
  constructor(@InjectModel(DaoSettings.name) private daoSettingsModel: Model<DaoSettingsDocument>) {}

  async findAll(): Promise<DaoSettingsDto[]> {
    const docs = await this.daoSettingsModel.find().exec()
    return docs.map((doc) => toDTO<DaoSettingsDto>(doc))
  }

  async loadSettings(chainId: string, daoId: string): Promise<DaoSettingsDocument | null> {
    const doc = await this.daoSettingsModel.findOne({ chainId, daoId }).exec()
    return doc || null
  }

  async getSettings(chainId: string, daoId: string): Promise<DaoSettingsDto> {
    const daoSettings = await this.loadSettings(chainId, daoId)
    if (!daoSettings) return { chainId, daoId }
    return toDTO<DaoSettingsDto>(daoSettings)
  }

  async setSettings(daoSettingsDto: DaoSettingsDto): Promise<DaoSettingsDto> {
    if (!daoSettingsDto.chainId) throw new BadRequestException('Missing chainId')
    if (!daoSettingsDto.daoId) throw new BadRequestException('Missing daoId')
    let settingsDocument = await this.loadSettings(daoSettingsDto.chainId, daoSettingsDto.daoId)
    if (!settingsDocument) {
      settingsDocument = new this.daoSettingsModel({
        chainId: daoSettingsDto.chainId,
        daoId: daoSettingsDto.daoId,
      })
    }

    settingsDocument.discordWebhookBotName = daoSettingsDto.discordWebhookBotName
    settingsDocument.discordWebhookUrl = daoSettingsDto.discordWebhookUrl
    await settingsDocument.save()

    return toDTO<DaoSettingsDto>(settingsDocument)
  }
}
