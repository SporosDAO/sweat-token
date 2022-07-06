import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DaoSettingsDocument = DaoSettings & Document

@Schema()
export class DaoSettings {
  @Prop({
    unique: true,
    required: true,
  })
  daoId: string

  @Prop({
    required: false,
  })
  discordWebhookUrl: string

  @Prop({
    required: false,
  })
  discordWebhookBotName: string

  @Prop({
    required: true,
    default: () => new Date(),
  })
  created: string

  @Prop({
    required: false,
    default: () => new Date(),
  })
  updated: string
}

export const DaoSettingsSchema = SchemaFactory.createForClass(DaoSettings)
