import { Module } from '@nestjs/common'
import { MemberService } from './member.service'
import { MemberController } from './member.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Member, MemberSchema } from './member.schema'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]), UserModule],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
