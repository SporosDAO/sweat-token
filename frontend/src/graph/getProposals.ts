import { GRAPH_URL } from './url'
import { useQuery } from 'react-query'
// import KaliDaoAbi from '../abi/KaliDAO.json'
// import { useContractReads } from 'wagmi'

export const getProposals = async ({ chainId, daoAddress }: { chainId: number; daoAddress: string | undefined }) => {
  if (!daoAddress) return null
  const dao = daoAddress.toLowerCase()
  const res = await fetch(GRAPH_URL[chainId], {
    method: 'POST',
    body: JSON.stringify({
      query: `query {
          proposals(
            first: 200,
            orderBy: serial,
            orderDirection: desc
            where: {dao: "${dao}"}) {
              id
              serial
              proposer
              proposalType
              description
              sponsor
              sponsored
              cancelled
              escaped
              status
              creationTime
              votingStarts
              accounts
              amounts
              payloads
              votes {
                voter
                vote
                weight
              }
              dao {
                votingPeriod
                quorum
                token {
                  totalSupply
                  symbol
                }
              }
          }
          }`
    })
  })

  const data = await res.json()
  return data?.data?.proposals
}

/**
 * Filters proposals that can be processed immediately without triggering on-chain errors.
 *
 * @returns array of proposals that can be immediately prcessed.
 *
 */
export function findProcessableProposals(proposals: any[]): any[] {
  function isAvailableToProcess(proposal: any, index: number, proposals: any[]) {
    // console.debug({ proposal })
    // unsponsored
    if (!proposal?.sponsored) {
      // console.debug('unsponsored')
      return false
    }
    // voting not closed yet
    const now = new Date()
    const vstarts = proposal?.votingStarts
    // console.debug('vstarts as Date:', new Date(vstarts * 1000))
    const vperiod = proposal.dao?.votingPeriod
    const vcloses = new Date(vstarts * 1000 + vperiod * 1000)
    const timeLeft = now.getTime() - vcloses.getTime()
    if (timeLeft <= 0) {
      // console.debug('voting not closed', { now, vstarts, vperiod, vcloses, timeLeft })
      return false
    }

    // already processed
    if (proposal.status !== null && proposal.status !== undefined) {
      // console.debug('already processed')
      return false
    }

    // if type ESCAPE then allow to process
    if (proposal.proposalType === 'ESCAPE') {
      // console.debug('escape prop')
      return true
    }

    // if ESCAPED (when processing blocked by revert)
    // then do not offer for processing
    if (proposal.escaped || proposal.cancelled) {
      // console.debug('escaped prop')
      return false
    }

    // If CANCELLED (by original proposal) then do not offer for processing
    if (proposal.escaped || proposal.cancelled) {
      // console.debug('cancelled prop')
      return false
    }

    // If non-ESCAPE, make sure it's next in queue
    // otherwise Kali smart contract will block processing.
    // Also make sure it's not an ESCAPED or CANCELLED proposal.
    if (index + 1 < proposals.length && proposals[index + 1].status != null) {
      proposal.isReadyToProcessImmediately = true
      // console.debug('ready to process')
      return true
    }

    // console.debug('not ready to process')
    return false
  }
  const availableToProcess = proposals?.filter(isAvailableToProcess)
  return availableToProcess
}

export function useGetProposals({
  chainId,
  daoAddress,
  queryOptions
}: {
  chainId: number
  daoAddress: string | undefined
  queryOptions?: any
}) {
  return useQuery(
    ['getProposals', chainId, daoAddress],
    async () => {
      const data = await getProposals({ chainId, daoAddress })
      return data
    },
    { ...queryOptions }
  )
}

/**
 *
 * Fetches a single proposal details
 *
 * @param {number} chainId - DAO home ETH chain ID
 * @param {string} daoAddress - DAO address
 * @param {number} proposalSerial - serial number of the proposal
 * @returns proposal details
 */
export async function getProposal({
  chainId,
  daoAddress,
  proposalSerial
}: {
  chainId: number
  daoAddress: string | undefined
  proposalSerial: number
}) {
  if (!daoAddress) return null
  const dao = daoAddress.toLowerCase()
  const res = await fetch(GRAPH_URL[chainId], {
    method: 'POST',
    body: JSON.stringify({
      query: `query {
          proposals(
            first: 200,
            orderBy: serial,
            orderDirection: desc
            where: {dao: "${dao}" serial: ${proposalSerial}} ) {
              id
              serial
              proposer
              proposalType
              description
              sponsor
              sponsored
              cancelled
              status
              creationTime
              votingStarts
              accounts
              amounts
              payloads
              votes {
                voter
                vote
                weight
              }
              dao {
                votingPeriod
                quorum
                token {
                  totalSupply
                  symbol
                }
              }
          }
          }`
    })
  })

  const data = await res.json()
  return data?.data?.proposals?.length ? data?.data?.proposals[0] : null
}

export function useGetProposal({
  chainId,
  daoAddress,
  proposalSerial,
  queryOptions
}: {
  chainId: number
  daoAddress: string | undefined
  proposalSerial: number
  queryOptions?: any
}) {
  return useQuery(
    ['getProposal', chainId, daoAddress, proposalSerial],
    async () => {
      const data = await getProposal({ chainId, daoAddress, proposalSerial })
      return data
    },
    { ...queryOptions }
  )
}

/**
 *
 * Fetch DAO proposal details
 * *
 * @param {*} chainId
 * @param {*} daoAddress
 * @param {*} proposalSerial
 *
 * @returns proposal details
 */
// export function useGetProposalDetails(chainId: number, daoAddress: string, proposalSerial: number) {
//   const cid = Number(chainId)
//   const daoContract = {
//     addressOrName: daoAddress || '0xUnknown',
//     contractInterface: KaliDaoAbi,
//     chainId: cid
//   }
//   const result = useContractReads({
//     contracts: [
//       {
//         ...daoContract,
//         functionName: 'proposals'
//       },
//       {
//         ...daoContract,
//         functionName: 'getProposalArrays'
//       }
//     ],
//     onError(readProposalArraysError: any) {
//       console.error({ readProposalArraysError })
//     }
//   })
//   return result
// }
