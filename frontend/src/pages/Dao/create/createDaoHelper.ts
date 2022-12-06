import { ethers } from 'ethers'

type DaoFounders = [{ address: string; initialTokens: number; email: string }]

export type CreateDaoForm = {
  name: string
  symbol: string
  terms: boolean
  transferability: boolean
  founders: DaoFounders
  voting: {
    period: { hours: number }
    quorum: number
    approval: number
  }
}

export function validateFounders(founders: DaoFounders) {
  const voters = []
  const shares = []

  for (let i = 0; i < founders.length; i++) {
    voters.push(founders[i].address)
    shares.push(ethers.utils.parseEther(founders[i].initialTokens.toString()))
  }

  return { voters, shares }
}

// const {
//   data,
//   writeAsync,
//   isLoading: isWritePending,
//   isSuccess: isWriteSuccess,
//   isError,
//   error
// } = useContractWrite(
//   {
//     mode: 'recklesslyUnprepared',
//     addressOrName: activeChain?.id ? addresses[activeChain.id]['factory'] : AddressZero,
//     contractInterface: FACTORY_ABI,
//     functionName: 'deployKaliDAO'
//   },
//   {
//     onSuccess(data) {
//       console.log('success!', data)
//     }
//   }
// )

/**
 * Deploy a Kali Co Series LLC cell using KaliDAO Factory
 * TODO: In the future, replace LLC formation with Kali wrappr contract
 *
 */
export function prepareKaliDaoCell(formData: CreateDaoForm): any[] {
  const { name, symbol, transferability, voting, founders } = formData

  // signal to KaliDAOFactory to mint a new Series LLC cell
  // https://github.com/kalidao/kali-contracts/blob/de721b483b04feba5c42b49b997d68e8ce4885dd/contracts/KaliDAOfactory.sol#L59
  const docs_ = ''

  const voteTime = voting.period.hours * 60 * 60

  // get voters and shares array
  const { voters, shares } = validateFounders(founders)

  /* govSettings
    0 : votingPeriod
    1: gracePeriod
    2: quorum
    3: supermajority
    4: proposalVoteTypes[ProposalType.MINT]
    5: proposalVoteTypes[ProposalType.BURN]
    6: proposalVoteTypes[ProposalType.CALL]
    7: proposalVoteTypes[ProposalType.VPERIOD]
    8: proposalVoteTypes[ProposalType.GPERIOD]
    9: proposalVoteTypes[ProposalType.QUORUM]
    10: proposalVoteTypes[ProposalType.SUPERMAJORITY]
    11: proposalVoteTypes[ProposalType.TYPE]
    12: proposalVoteTypes[ProposalType.PAUSE]
    13: proposalVoteTypes[ProposalType.EXTENSION]
    14: proposalVoteTypes[ProposalType.ESCAPE]
    15: proposalVoteTypes[ProposalType.DOCS]
    */
  let govSettings
  if (voting.approval > 51) {
    govSettings = [voteTime, 0, voting.quorum, voting.approval, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
  } else {
    govSettings = [voteTime, 0, voting.quorum, 52, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  }

  // no extensions enabled at deployment
  // user can enable later via specialized front ends
  const extensionsArray: any[] = []
  const extensionsData: any[] = []

  console.log(
    'deploy params',
    name,
    symbol,
    docs_,
    Number(!transferability),
    extensionsArray,
    extensionsData,
    voters,
    shares,
    govSettings
  )

  // Prepare input args for KaliDAO.init() call
  // https://github.com/kalidao/kali-contracts/blob/de721b483b04feba5c42b49b997d68e8ce4885dd/contracts/KaliDAO.sol#L145
  const initArgs = [
    name,
    symbol,
    docs_,
    Number(!transferability),
    extensionsArray,
    extensionsData,
    voters,
    shares,
    govSettings
  ]

  return initArgs
}
