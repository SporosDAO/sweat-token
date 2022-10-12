import { Box, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useProvider } from 'wagmi'
import { useEffect, useState } from 'react'
import { getProjectTributesById } from '../../graph/getProjects'

interface Tribute {
  projectId: number
  contributorAddress: string
  amount: string
  tributeString: string
  tributeTitle?: string
  tributeLink?: string
}

export default function ProjectDetails() {
  const { chainId, daoId, projectId } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [tributes, setTributes] = useState<Tribute[]>([])

  const cid = Number(chainId)
  const provider = useProvider({ chainId: cid })

  useEffect(() => {
    const getTributes = async () => {
      const data = await getProjectTributesById(cid, daoId, provider, parseInt(projectId || '', 10))
      const formattedData = data.map((tribute) => {
        const tributeDetails = JSON.parse(tribute.tributeString)[0]
        return { ...tributeDetails, ...tribute }
      })

      setTributes(formattedData)
    }

    getTributes().catch((error) => console.log(error))
  }, [cid, daoId, projectId, provider])

  return (
    <Box>
      <IconButton>
        <ArrowBackIcon onClick={() => navigate(pathname.substring(0, pathname.lastIndexOf('/')))} />
      </IconButton>
      <h1>Project {projectId}</h1>
      <TableContainer component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>Tribute Title</TableCell>
            <TableCell>Contributor Address </TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tributes.map((tribute) => {
            const { tributeTitle, contributorAddress, amount, tributeLink } = tribute

            return (
              <TableRow>
                <TableCell>{tributeTitle}</TableCell>
                <TableCell>{contributorAddress}</TableCell>
                <TableCell>{amount}</TableCell>
                <TableCell>{tributeLink}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </TableContainer>
    </Box>
  )
}
