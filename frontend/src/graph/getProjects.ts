import { useContractRead, useContractReads } from 'wagmi'
import PM_ABI from '../abi/ProjectManagement.json'
import { addresses } from '../constants/addresses'
import { ethers } from 'ethers'

/**
 *
 * Alternative to theGraph function, which has intermittent data availability issues.
 *
 *
 * @param {*} chainId
 * @param {*} daoAddress
 * @returns array of project records
 */
function useGetProjectsRPC(chainId: number) {
  const cid = Number(chainId)
  const pmAddress = addresses[cid]['extensions']['projectmanagement']
  let result

  const pmContract = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    addressOrName: pmAddress!,
    contractInterface: PM_ABI,
    chainId: cid
  }
  result = useContractRead({
    ...pmContract,
    functionName: 'nextProjectId',
    onError(readNextProjectIdError) {
      console.error({ readNextProjectIdError })
    }
  })
  const nextProjectId = result.data ? Number(result.data) : 100 // low watermark in PM contract
  const projectRequests = []
  for (let pid = nextProjectId - 1; pid >= 100; pid--) {
    projectRequests.push({
      ...pmContract,
      functionName: 'projects',
      args: [pid]
    })
  }
  result = useContractReads({
    contracts: projectRequests,
    onError(readProjectsError) {
      console.error({ readProjectsError })
    }
  })
  return result
}

export function useGetProjects(chainId: number, daoAddress: string | undefined) {
  const { data, error, isError, isLoading, isSuccess } = useGetProjectsRPC(chainId)
  const projects: any[] = []
  if (data) {
    data.forEach((project) => {
      if (project.dao.toLowerCase() === daoAddress?.toLowerCase()) {
        let goals = {}
        try {
          goals = JSON.parse(project.goals)
        } catch (err) {
          console.warn('Unable to JSON parse project goals. Falling back to plaintext.', { err })
          goals = [{ goalTitle: project.goals, goalLink: '' }]
        }
        const prj = {
          projectID: Number(project.id),
          budget: ethers.utils.formatEther(project.budget),
          deadline: project.deadline,
          manager: project.manager,
          goals
        }
        projects.push(prj)
      }
    })
  }
  return { projects, error, isError, isLoading, isSuccess }
  /**
  return useQuery(['getProjects', chainId, daoAddress], async () => {
    const data = await getProjects(chainId, daoAddress)
    return data
  })
  */
}
