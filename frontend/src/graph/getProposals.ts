import { GRAPH_URL } from './url'
import { useQuery } from '@tanstack/react-query'
import KaliDaoAbi from '../abi/KaliDAO.json'
import { useContractReads } from 'wagmi'

export const getProposals = async ({ chainId, daoAddress }: { chainId: number; daoAddress: string | undefined }) => {
  if (!daoAddress) return null
  const dao = daoAddress.toLowerCase()
  try {
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
  } catch (e) {
    return e
  }
}

/**
 * Filters proposals that can be processed immediately without triggering on-chain errors.
 *
 * @returns array of proposals that can be immediately prcessed.
 *
 */
export function findProcessableProposals(proposals: any[]): any[] {
  function isAvailableToProcess(proposal: any, index: number, proposals: any[]) {
    // unsponsored
    if (!proposal?.sponsored) {
      return false
    }
    // expired
    const timeLeft =
      new Date().getTime() - new Date(proposal.dao?.votingPeriod * 1000 + proposal?.votingStarts * 1000).getTime()
    if (timeLeft <= 0) {
      return false
    }

    // already processed
    if (proposal.status !== null) {
      return false
    }

    // if type ESCAPE then allow to process
    if (proposal.proposalType === 'ESCAPE') {
      return true
    }

    // if non-ESCAPE, make sure it's next in queue
    // otherwise Kali smart contract will block processing
    if (index + 1 < proposals.length && proposals[index + 1].status != null) {
      proposal.isReadyToProcessImmediately = true
      return true
    }

    return false
  }
  const availableToProcess = proposals.filter(isAvailableToProcess)
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
  try {
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
  } catch (e) {
    return e
  }
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
export function useGetProposalDetails(chainId: number, daoAddress: string, proposalSerial: number) {
  const cid = Number(chainId)
  const daoContract = {
    addressOrName: daoAddress || '0xUnknown',
    contractInterface: KaliDaoAbi,
    chainId: cid
  }
  const result = useContractReads({
    contracts: [
      {
        ...daoContract,
        functionName: 'proposals'
      },
      {
        ...daoContract,
        functionName: 'getProposalArrays'
      }
    ],
    onError(readProposalArraysError: any) {
      console.error({ readProposalArraysError })
    }
  })
  return result
}
