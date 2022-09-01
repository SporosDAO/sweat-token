import { RuntimeModule } from '@app/runtime'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { DaoProposalCronService } from './proposal/dao.proposal.cron.service'
import { DaoProposal, DaoProposalSchema } from './proposal/dao.proposal.schema'
import { DaoSettingsController } from './settings/dao.settings.controller'
import { DaoSettings, DaoSettingsSchema } from './settings/dao.settings.schema'
import { DaoSettingsService } from './settings/dao.settings.service'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RuntimeModule,
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: DaoProposal.name, schema: DaoProposalSchema },
      { name: DaoSettings.name, schema: DaoSettingsSchema },
    ]),
  ],
  providers: [DaoSettingsService, DaoProposalCronService],
  controllers: [DaoSettingsController],
})
export class AppModule {}
