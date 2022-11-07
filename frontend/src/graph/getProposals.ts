import { GRAPH_URL } from './url'
import { useQuery } from '@tanstack/react-query'
import KaliDaoAbi from '../abi/KaliDAO.json'
import { useContractReads } from 'wagmi'

export const getProposals = async (chainId: number, address: string | undefined) => {
  if (!address) return null
  const dao = address.toLowerCase()
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

export function useGetProposals(chainId: number, daoAddress: string | undefined) {
  return useQuery(['getProposals', chainId, daoAddress], async () => {
    const data = await getProposals(chainId, daoAddress)
    return data
  })
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
  console.debug({ result })
  return result
}