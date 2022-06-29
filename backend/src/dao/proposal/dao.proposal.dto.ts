export class SubgraphProposalVoters {
  voter: string
  vote: boolean
}

export class SubgraphProposalDao {
  quorum: string
  votingPeriod: string
}

export class SubgraphProposal {
  creationTime: number
  dao: SubgraphProposalDao
  description: string
  id: string
  serial: string
  status: unknown
  votes: SubgraphProposalVoters[]
}

export class SubgraphResponseData {
  proposals: SubgraphProposal[]
}

export class SubgraphResponse {
  data: SubgraphResponseData
}
