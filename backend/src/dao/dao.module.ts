import { Module } from '@nestjs/common'
import { DaoService } from './dao.service'
import { DaoController } from './dao.controller'
import { Dao, DaoSchema } from './dao.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [MongooseModule.forFeature([{ name: Dao.name, schema: DaoSchema }])],
  providers: [DaoService],
  controllers: [DaoController],
  exports: [DaoService],
})
export class DaoModule {}
