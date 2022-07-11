import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'
import { useContractRead, useContractReads } from 'wagmi'
import PM_ABI from '../abi/ProjectManagement.json'
import { addresses } from '../constants/addresses'
import { BigNumber } from 'ethers'

export const getProjects = async (chainId, daoAddress) => {
  console.log('getProjects', chainId, daoAddress)
  try {
    const res = await fetch(GRAPH_URL[chainId], {
      method: 'POST',
      body: JSON.stringify({
        query: `query {
          projects(
            orderBy: projectID,
            orderDirection: desc,
            where: {
              dao : "${daoAddress.toLowerCase()}"
            }) {
            active
            budget
            deadline
            goals
            id
            manager
            projectID
            dao {
              address
            }
          }
        }`
      })
    })
    console.log('result', res)
    // uncomment when Kali subgraph restores access to projects
    // const data = await res.json()
    // in the meanwhile use mock data
    const data = {
      projects: [
        {
          active: true,
          budget: 5000,
          deadline: 20220710,
          goals: 'New landing page',
          id: '112312312312',
          manager: '0xcc53685363e14914d28f2d37f226618451d4ef4c',
          projectID: '100',
          dao: {
            address: '0x60c03712765c1211d02c460b93cfe12d2bbee1dc'
          }
        },
        {
          active: true,
          budget: 10000,
          deadline: 20220810,
          goals: 'New Project Management UI flow',
          id: '1123123156742',
          manager: '0xf952a72F39c5Fa22a443200AbE7835128bCb7439',
          projectID: '101',
          dao: {
            address: '0x60c03712765c1211d02c460b93cfe12d2bbee1dc'
          }
        }
      ]
    }
    console.log({ data })
    return data
  } catch (e) {
    console.error('Error fetching projects', { e })
    return e
  }
}

/**
 *
 * Alternative to theGraph function, which has intermittent data availability issues.
 *
 *
 * @param {*} chainId
 * @param {*} daoAddress
 * @returns array of project records
 */
function useGetProjectsRPC (chainId, daoAddress) {
  console.log('getProjectsRPC', chainId, daoAddress)
  const cid = Number(chainId)
  const pmAddress = addresses[cid]['extensions']['projectmanagement']
  let result

  const pmContract = {
    addressOrName: pmAddress,
    contractInterface: PM_ABI,
    chainId: cid
  }
  result = useContractRead({
    ...pmContract,
    functionName: 'nextProjectId',
    onSuccess(data) {
      console.log({ data })
      const nextProjectId = Number(data)
      console.log({nextProjectId})
    },
  })
  console.log('useContractRead result', result)
  return result
}


export function useGetProjects(chainId, daoAddress) {
  /**
  const { data, error, isError, isLoading, isSuccess } = useGetProjectsRPC(chainId, daoAddress)
  return { data, error, isError, isLoading, isSuccess }
   */
  return useQuery(['getProjects', chainId, daoAddress], async () => {
    const data = await getProjects(chainId, daoAddress)
    return data
  })
}
