import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModule } from 'src/user/user.module'
import { MemberListenerService } from './member.listener.service'
import { Member, MemberSchema } from './member.schema'
import { MemberService } from './member.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]), UserModule],
  controllers: [],
  providers: [MemberService, MemberListenerService],
  exports: [MemberService],
})
export class MemberModule {}
