import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useProvider } from 'wagmi'
import { useEffect, useState } from 'react'
import { getProjectTributesById } from '../../graph/getProjects'
import { v4 as uuid } from 'uuid'

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
  const [tributesLoading, setTributesLoading] = useState(true)

  const cid = Number(chainId)
  const id = parseInt(projectId || '', 10)
  const provider = useProvider({ chainId: cid })

  useEffect(() => {
    if (!cid || !daoId) {
      return
    }

    const getTributes = async () => {
      const data = await getProjectTributesById(cid, daoId, provider, id)
      const formattedData = data?.map((tribute) => {
        const tributeDetails = JSON.parse(tribute.tributeString)[0]
        return { ...tributeDetails, ...tribute }
      })

      setTributes(formattedData as Tribute[])
      setTributesLoading(false)
    }

    getTributes().catch((error) => {
      console.log(error)
      setTributesLoading(false)
    })
  }, [cid, daoId, id, projectId, provider])

  return (
    <Box>
      <IconButton onClick={() => navigate(pathname.substring(0, pathname.lastIndexOf('/')))}>
        <ArrowBackIcon />
      </IconButton>
      <h1>Project {projectId}</h1>
      <TableContainer component={Paper}>
        <Table data-testid={'tribute-table'}>
          <TableHead>
            <TableRow>
              <TableCell>Tribute Title</TableCell>
              <TableCell>Contributor Address </TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!tributes.length && (
              <TableRow>
                <TableCell align={'center'} colSpan={3}>
                  {tributesLoading ? <CircularProgress /> : 'No tributes available...'}
                </TableCell>
              </TableRow>
            )}

            {tributes.map((tribute) => {
              const { tributeTitle, contributorAddress, amount, tributeLink } = tribute

              return (
                <TableRow key={uuid()}>
                  <TableCell>{tributeTitle}</TableCell>
                  <TableCell>{contributorAddress}</TableCell>
                  <TableCell>{amount}</TableCell>
                  <TableCell>{tributeLink}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
