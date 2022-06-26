import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Cron } from '@nestjs/schedule'
import axios from 'axios'
import { Model } from 'mongoose'
import * as webhook from 'webhook-discord'
import { SubgraphProposal, SubgraphResponse } from './dao.subgraph.dto'
import { DaoProposalNotification, DaoProposalNotificationDocument } from './dao.subgraph.schema'

@Injectable()
export class DaoSubgraphCronService implements OnModuleInit {
  private readonly logger = new Logger(DaoSubgraphCronService.name)

  private readonly subgraphUrl: string
  private readonly daoPublicKey: string
  private readonly discordWebhook: string

  constructor(
    private readonly config: ConfigService,
    @InjectModel(DaoProposalNotification.name) private notificationModel: Model<DaoProposalNotificationDocument>,
  ) {
    this.subgraphUrl = this.config.get('SUBGRAPH_KALI_URL')
    this.daoPublicKey = this.config.get('SUBGRAPH_DAOID')
    this.discordWebhook = this.config.get('SUBGRAPH_WEBHOOK')
  }

  @Cron('0 0 6 * * *')
  async handleCron() {
    this.logger.debug('Running subgraph cron check')
    this.checkProposals()
    this.sendNotifiations()
  }

  async onModuleInit(): Promise<void> {
    await this.handleCron()
  }

  async checkProposals(): Promise<void> {
    const proposals = await this.fetchSubgraph()
    if (proposals === null) {
      this.logger.log(`Failed to fetch proposals`)
      return
    }
    if (!proposals.length) {
      this.logger.debug(`No proposals found`)
      return
    }

    try {
      await this.update(proposals)
    } catch (e) {
      this.logger.error(`Failed to save new proposals: ${e.stack}`)
    }
  }

  async fetchSubgraph(): Promise<SubgraphProposal[] | null> {
    const query = `{
  proposals (
    first:5, 
    orderDirection: desc, 
    orderBy:creationTime, where: {
    dao: "${this.daoPublicKey}",
    status:null
  }){
    id
    serial
    status
    description
    dao {
      quorum
      votingPeriod
    }
    votes {
      voter
      vote
    }
    creationTime
  }
}`

    const headers = {
      'content-type': 'application/json',
    }

    try {
      const response = await axios({
        url: this.subgraphUrl,
        method: 'post',
        headers: headers,
        data: { query },
      })

      if (response.status !== 200) {
        this.logger.error(`Request failed with status ${response.status}`)
        return
      }

      const { data } = response.data as SubgraphResponse
      return data.proposals
    } catch (e) {
      // console.log(e)
      this.logger.error(`Request failed: ${e.response.status} ${e.response.data}`)
    }
    return null
  }

  async findById(proposalsId: string[]): Promise<DaoProposalNotificationDocument[]> {
    return this.notificationModel
      .find({
        proposalId: {
          $in: proposalsId,
        },
      })
      .exec()
  }

  async findUnsent(): Promise<DaoProposalNotificationDocument[]> {
    return this.notificationModel
      .find({
        sent: { $exists: false },
      })
      .exec()
  }

  async update(proposals: SubgraphProposal[]): Promise<DaoProposalNotificationDocument[]> {
    const proposalsId = proposals.map((p) => p.id)
    const savedProposals = (await this.findById(proposalsId)).map((p) => p.proposalId)

    const newProposals = proposals.filter((p) => savedProposals.indexOf(p.id) === -1)
    this.logger.log(`Found ${newProposals.length} new proposals`)
    return await Promise.all(
      newProposals.map(async (p) => {
        this.logger.log(`Saving proposal id=${p.id}`)
        const proposal = new this.notificationModel({
          proposalId: p.id,
          daoId: this.daoPublicKey,
          message: p.description,
          deadline: new Date(+p.creationTime * 1000 + +p.dao.votingPeriod * 1000),
          quorum: +p.dao.quorum,
        })
        return proposal.save()
      }),
    )
  }

  async sendNotifiations(): Promise<void> {
    const proposals = await this.findUnsent()
    this.logger.debug(`Sending ${proposals.length} notifications`)
    const Hook = new webhook.Webhook(this.discordWebhook)
    for (let i = 0; i < proposals.length; i++) {
      const proposal = proposals[i]
      const msg = new webhook.MessageBuilder().setName('sporos-bot').setText(proposal.message)
      // Hook.send(msg)
      this.logger.log(`Send message: ${proposal.message}`)
    }
  }
}
