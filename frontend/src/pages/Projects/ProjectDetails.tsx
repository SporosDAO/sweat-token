import { Box, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { useParams } from 'react-router-dom'

import { useProvider } from 'wagmi'
import { useEffect, useState } from 'react'
import { getProjectTributesById } from '../../graph/getProjects'

interface Tribute {
  projectId: number
  contributorAddress: string
  amount: string
  tributeString: string
}

export default function ProjectDetails() {
  const { chainId, daoId, projectId } = useParams()
  const [tributes, setTributes] = useState<Tribute[]>([])

  const cid = Number(chainId)
  const provider = useProvider({ chainId: cid })

  useEffect(() => {
    const getTributes = async () => {
      const data = await getProjectTributesById(cid, daoId, provider, parseInt(projectId || '', 10))
      setTributes(data)
    }

    getTributes().catch((error) => console.log(error))
  }, [cid, daoId, projectId, provider])

  return (
    <Box>
      <h1>Project {projectId}</h1>
      <TableContainer component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Contributor Address </TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tributes.map((tribute) => (
            <TableRow>
              <TableCell>{tribute.contributorAddress}</TableCell>
              <TableCell>{tribute.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>
    </Box>
  )
}
