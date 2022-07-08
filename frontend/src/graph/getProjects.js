import { useQuery } from 'react-query'
import { GRAPH_URL } from './url'

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
    return data
  } catch (e) {
    return e
  }
}

export function useGetProjects(chainId, daoAddress) {
  return useQuery(['getProjects', chainId, daoAddress], async () => {
    const data = await getProjects(chainId, daoAddress)
    return data
  })
}
