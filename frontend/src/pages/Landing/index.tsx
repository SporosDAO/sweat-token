import { Box, List, ListItem, Paper } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listDaos } from '../../api'
import { DaoDto } from '../../api/openapi'

export default function Landing() {
  const [publicDaos, setPublicDaos] = useState<DaoDto[]>()

  useEffect(() => {
    if (publicDaos !== undefined) return
    listDaos().then((daos: DaoDto[]) => {
      setPublicDaos(daos)
    })
  })

  return (
    <Box sx={{ p: 5 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <h1>Welcome to Sweat Token</h1>

        <p>This is a placeholder for a landing page</p>

        <List>
          {(publicDaos || []).map((dao) => (
            <ListItem key={dao.daoId}>
              <Link to={`/${dao.daoId}/dashboard`}>{dao.name}</Link>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  )
}
