import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Cron } from '@nestjs/schedule'
import axios from 'axios'
import { Model } from 'mongoose'
import * as webhook from 'webhook-discord'
import { SubgraphProposal, SubgraphResponse } from './dao.proposal.dto'
import { DaoProposal, DaoProposalDocument } from './dao.proposal.schema'

@Injectable()
export class DaoProposalCronService implements OnModuleInit {
  private readonly logger = new Logger(DaoProposalCronService.name)

  private readonly subgraphUrl: string
  private readonly daoPublicKey: string
  private readonly discordWebhookUrl: string
  private readonly discordWebhookName: string

  constructor(
    private readonly config: ConfigService,
    @InjectModel(DaoProposal.name) private notificationModel: Model<DaoProposalDocument>,
  ) {
    this.subgraphUrl = this.config.get('SUBGRAPH_KALI_URL')
    this.daoPublicKey = this.config.get('SUBGRAPH_DAOID')
    this.discordWebhookUrl = this.config.get('SUBGRAPH_WEBHOOK_URL')
    this.discordWebhookName = this.config.get('SUBGRAPH_WEBHOOK_NAME')
  }

  @Cron('0 0 6 * * *')
  async handleCron() {
    if (!this.discordWebhookUrl) {
      return
    }
    this.logger.debug('Running subgraph cron check')
    await this.checkProposals()
    await this.sendNotifiations()
  }

  async onModuleInit(): Promise<void> {
    if (!this.discordWebhookUrl) {
      this.logger.log(`Discord webhook url not set, cron disabled`)
      return
    }
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

  async findById(proposalsId: string[]): Promise<DaoProposalDocument[]> {
    return this.notificationModel
      .find({
        proposalId: {
          $in: proposalsId,
        },
      })
      .exec()
  }

  async findUnsent(): Promise<DaoProposalDocument[]> {
    return this.notificationModel
      .find({
        notified: { $exists: false },
      })
      .exec()
  }

  async update(proposals: SubgraphProposal[]): Promise<DaoProposalDocument[]> {
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
        return await proposal.save()
      }),
    )
  }

  async sendNotifiations(): Promise<void> {
    const proposals = await this.findUnsent()
    this.logger.debug(`Sending ${proposals.length} notifications`)
    const Hook = new webhook.Webhook(this.discordWebhookUrl)
    for (let i = 0; i < proposals.length; i++) {
      const proposal = proposals[i]
      Hook.info(this.discordWebhookName, proposal.message)
      proposal.notified = new Date()
      await proposal.save()
      this.logger.debug(`Sent ${proposal.id} notification`)
    }
  }
}
