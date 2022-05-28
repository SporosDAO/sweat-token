import { randomString, toDTO } from '@app/runtime/util'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import {
  CreateMemberDto,
  ExtendedMemberDto,
  MemberDto,
  MemberEvent,
  MemberInviteDto,
  MemberQueryDto,
  MemberStatus,
} from './member.dto'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Member, MemberDocument } from './member.schema'
import { RecordEventType } from '@app/runtime/event.dto'
import { UserService } from 'src/user/user.service'
import { UserDto } from 'src/user/user.dto'

@Injectable()
export class MemberService {
  constructor(
    private eventEmitter: EventEmitter2,
    private userService: UserService,
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
  ) {}

  toDto(doc: MemberDocument): MemberDto {
    return toDTO<MemberDto>(doc)
  }

  private emit(type: RecordEventType, member: MemberDto | MemberDocument) {
    this.eventEmitter.emit('member.changed', {
      memberId: member.memberId,
      userId: member.userId,
      daoId: member.daoId,
      type,
    } as MemberEvent)
  }

  async invite(invite: MemberInviteDto): Promise<MemberDto> {
    const publicAddress = invite.publicAddress

    let user = await this.userService.load({ publicAddress })
    if (!user) {
      user = await this.userService.create({ publicAddress } as UserDto)
    }

    const previousInvitation = await this.load({
      userId: user.userId,
      daoId: invite.daoId,
    })

    if (previousInvitation) {
      await this.delete(previousInvitation.memberId)
    }

    const memberDto: CreateMemberDto = {
      daoId: invite.daoId,
      roles: invite.roles || [],
      invitation: `${randomString()}${randomString()}`,
      status: MemberStatus.pending,
      userId: user.userId,
    }

    return await this.create(memberDto)
  }

  async create(memberDto: CreateMemberDto): Promise<MemberDto> {
    memberDto.status = memberDto.status || MemberStatus.pending
    const member = new this.memberModel(memberDto)
    await member.save()
    this.emit('create', member)
    return this.toDto(member)
  }

  async read(memberId: string): Promise<MemberDto> {
    const member = await this.memberModel.findOne({ memberId }).exec()
    return member ? this.toDto(member) : null
  }

  async load(memberDto: Partial<MemberDto>): Promise<MemberDto> {
    if (Object.keys(memberDto).length === 0) throw new BadRequestException()
    const member = await this.memberModel.findOne(memberDto).exec()
    return member ? this.toDto(member) : null
  }

  async update(memberDto: MemberDto): Promise<MemberDto> {
    if (!memberDto) throw new BadRequestException()
    const { memberId } = memberDto
    if (memberId) throw new BadRequestException()
    const member = await this.read(memberDto.memberId)
    if (!member) throw new NotFoundException()

    const updates = {
      ...member,
      ...memberDto,
    }

    const res = await this.memberModel.updateOne({ memberId }, updates)
    if (!res.matchedCount) throw new NotFoundException()

    this.emit('update', member)

    return await this.read(memberId)
  }

  async delete(memberId: string): Promise<void> {
    const member = await this.read(memberId)
    if (!member) return
    await this.memberModel.deleteOne({ memberId }).exec()
    this.emit('delete', member)
  }

  async deleteAll(filter?: FilterQuery<MemberDocument>): Promise<void> {
    await this.memberModel.deleteMany(filter).exec()
  }

  async deleteByProject(projectId: string): Promise<void> {
    await this.memberModel.deleteMany({ projectId }).exec()
  }

  async find(query: MemberQueryDto): Promise<MemberDto[]> {
    const q: FilterQuery<MemberDocument> = {}

    if (query.memberId) q.memberId = query.memberId
    if (query.userId) q.userId = query.userId
    if (query.daoId) q.daoId = query.daoId
    if (query.status) q.status = query.status
    if (query.skills) q.skills = query.skills

    const dateField = query.dateField || 'created'

    if (query.from) {
      q[dateField] = {
        $gte: query.from,
      }
    }
    if (query.to) {
      q[dateField] = q[dateField] || {}
      q[dateField].$lte = query.to
    }

    const find = this.memberModel.find(q)

    if (query.limit) find.limit(query.limit)
    if (query.skip) find.skip(query.limit)

    const res = await find.exec()
    return res.map((doc) => this.toDto(doc))
  }

  async list(query: MemberQueryDto): Promise<ExtendedMemberDto[]> {
    const members = await this.find(query)
    const users = (
      await this.userService.find({
        userId: members.map((m) => m.userId),
      })
    ).reduce((o, u) => ({ ...o, [u.userId]: u }), {})
    return members.map(
      (m) =>
        ({
          ...m,
          ...users[m.userId],
          roles: m.roles,
        } as ExtendedMemberDto),
    )
  }
}
