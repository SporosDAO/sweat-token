import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { DaoEvent } from 'src/dao/dao.dto'
import { Role } from 'src/user/user.dto'
import { UserService } from 'src/user/user.service'
import { MemberStatus } from './member.dto'
import { MemberService } from './member.service'

@Injectable()
export class MemberListenerService {
  constructor(private userService: UserService, private memberService: MemberService) {}

  @OnEvent('dao.change')
  async onDaoChange(ev: DaoEvent) {
    switch (ev.type) {
      case 'create':
        // create owner
        await this.memberService.create({
          daoId: ev.daoId,
          userId: ev.ownerId,
          roles: [Role.admin],
          status: MemberStatus.enabled,
        })

        break
      case 'delete':
        // delete owners
        await this.memberService.deleteAll({
          daoId: ev.daoId,
          userId: ev.ownerId,
        })

        break
    }
  }
}
