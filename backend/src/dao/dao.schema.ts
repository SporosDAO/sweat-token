import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export type DaoDocument = Dao & Document

@Schema()
export class Dao {
  @Prop({
    default: () => uuidv4(),
    unique: true,
  })
  daoId: string

  @Prop({
    required: false,
  })
  name: string
}

export const DaoSchema = SchemaFactory.createForClass(Dao)
