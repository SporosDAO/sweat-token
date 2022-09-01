import { graphEndpoints } from '@app/runtime/graph-endpoints'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Cron } from '@nestjs/schedule'
import axios from 'axios'
import { Model } from 'mongoose'
import * as webhook from 'webhook-discord'
import { DaoSettingsDto } from '../settings/dao.settings.dto'
import { DaoSettingsService } from '../settings/dao.settings.service'
import { SubgraphProposal, SubgraphResponse } from './dao.proposal.dto'
import { DaoProposal, DaoProposalDocument } from './dao.proposal.schema'

@Injectable()
export class DaoProposalCronService implements OnModuleInit {
  private readonly logger = new Logger(DaoProposalCronService.name)

  constructor(
    private readonly daoSettings: DaoSettingsService,
    @InjectModel(DaoProposal.name) private proposalModel: Model<DaoProposalDocument>,
  ) {}

  @Cron('0 0 6 * * *')
  async handleCron() {
    this.logger.debug('Running subgraph cron check')
    const settings = await this.findSettings()
    await Promise.all(
      settings.map(async (daoSettings) => {
        await this.checkProposals(daoSettings)
        await this.sendNotifiations(daoSettings)
      }),
    )
  }

  async onModuleInit(): Promise<void> {
    await this.handleCron()
  }

  findSettings(): Promise<DaoSettingsDto[]> {
    return this.daoSettings.findAll()
  }

  async checkProposals(daoSettings: DaoSettingsDto): Promise<void> {
    const proposals = await this.fetchSubgraph(daoSettings.chainId, daoSettings.daoId)
    if (proposals === null) {
      this.logger.log(`Failed to fetch proposals`)
      return
    }
    if (!proposals.length) {
      this.logger.debug(`No proposals found`)
      return
    }

    try {
      await this.update(daoSettings, proposals)
    } catch (e) {
      this.logger.error(`Failed to save new proposals: ${e.stack}`)
    }
  }

  async fetchSubgraph(chainId: string, daoId: string): Promise<SubgraphProposal[] | null> {
    const query = `{
  proposals (
    first:5,
    orderDirection: desc,
    orderBy:creationTime, where: {
    dao: "${daoId}",
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
      const endpoint = graphEndpoints[chainId]
      if (!endpoint) {
        this.logger.warn(`No graph endpoint for chainId=${chainId}`)
        return null
      }
      const response = await axios({
        url: endpoint,
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
    return this.proposalModel
      .find({
        proposalId: {
          $in: proposalsId,
        },
      })
      .exec()
  }

  async findUnsent(): Promise<DaoProposalDocument[]> {
    return this.proposalModel
      .find({
        notified: { $exists: false },
      })
      .exec()
  }

  async update(daoSettings: DaoSettingsDto, proposals: SubgraphProposal[]): Promise<DaoProposalDocument[]> {
    const proposalsId = proposals.map((p) => p.id)
    const savedProposals = (await this.findById(proposalsId)).map((p) => p.proposalId)

    const newProposals = proposals.filter((p) => savedProposals.indexOf(p.id) === -1)
    this.logger.log(`Found ${newProposals.length} new proposals`)
    return await Promise.all(
      newProposals.map(async (p) => {
        this.logger.log(`Saving proposal id=${p.id}`)
        const proposal = new this.proposalModel({
          proposalId: p.id,
          chainId: daoSettings.chainId,
          daoId: daoSettings.daoId,
          message: p.description,
          deadline: new Date(+p.creationTime * 1000 + +p.dao.votingPeriod * 1000),
          quorum: +p.dao.quorum,
        })
        return await proposal.save()
      }),
    )
  }

  async sendNotifiations(daoSettings: DaoSettingsDto): Promise<void> {
    const proposals = await this.findUnsent()
    this.logger.debug(`Sending ${proposals.length} notifications`)

    if (!daoSettings.discordWebhookUrl || !daoSettings.discordWebhookBotName) {
      this.logger.debug(`daoId=${daoSettings.daoId} misses webhook info`)
      return
    }

    const Hook = new webhook.Webhook(daoSettings.discordWebhookUrl)
    for (let i = 0; i < proposals.length; i++) {
      const proposal = proposals[i]
      Hook.info(daoSettings.discordWebhookBotName, proposal.message)
      proposal.notified = new Date()
      await proposal.save()
      this.logger.debug(`Sent ${proposal.id} notification`)
    }
  }
}
