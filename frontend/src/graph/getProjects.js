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
function useGetProjectsRPC(chainId) {
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

export function useGetProjects(chainId, daoAddress) {
  const { data, error, isError, isLoading, isSuccess } = useGetProjectsRPC(chainId, daoAddress)
  const projects = []
  if (data) {
    data.forEach((project) => {
      if (project.dao.toLowerCase() === daoAddress.toLowerCase()) {
        let goals = {}
        try {
          goals = JSON.parse(project.goals)
        } catch (err) {
          console.warn('Unable to JSON parse project goals. Falling back to plaintext.', { err })
          goals = [{ goalTitle: project.goals, goalLink: '' }]
        }
        const prj = {
          projectID: project.id.toNumber(),
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

export async function getProjectTributes(chainId, daoAdress, provider, projectId) {
  const pmAddress = addresses[chainId]['extensions']['projectmanagement']

  const pmContract = new ethers.Contract(pmAddress, PM_ABI, provider)

  const filter = pmContract.filters.ExtensionCalled(daoAdress, null)

  const result = await pmContract.queryFilter(filter)

  const rawData = result.map((entry) => entry.args.updates[0])

  const decodedData = rawData.map((entry) =>
    ethers.utils.defaultAbiCoder.decode(['uint256', 'address', 'uint256', 'string'], entry)
  )

  const tributeData = decodedData.map((entry) => {
    return {
      projectId: parseInt(ethers.utils.formatUnits(entry[0], 0), 10),
      contributorAddress: entry[1],
      amount: ethers.utils.formatEther(entry[2]),
      tributeString: entry[3]
    }
  })

  return tributeData.filter((tribute) => tribute.projectId === projectId)
}
