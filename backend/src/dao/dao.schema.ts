import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export type DaoDocument = Dao & Document

@Schema()
export class Dao {
  @Prop({
    default: () => uuidv4(),
    unique: true,
    required: true,
  })
  daoId: string

  @Prop({
    required: true,
  })
  name: string

  @Prop({
    required: false,
  })
  mission: string
  @Prop({
    required: false,
  })
  website: string
  @Prop({
    required: false,
  })
  logo: string
  @Prop({
    required: true,
  })
  kaliAddress: string
  @Prop({
    required: true,
    default: () => false,
  })
  isPrivate: boolean
  @Prop({
    required: true,
    default: () => new Date(),
  })
  created: Date
}

export const DaoSchema = SchemaFactory.createForClass(Dao)
