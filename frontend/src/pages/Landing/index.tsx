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

  let myDaos
  if (publicDaos) {
    myDaos = (
      <List>
        {(publicDaos || []).map((dao) => (
          <ListItem key={dao.daoId}>
            <Link to={`/${dao.daoId}/dashboard`}>{dao.name}</Link>
          </ListItem>
        ))}
      </List>
    )
  } else {
    myDaos = (
      <p>
        <span>
          <a href="https://app.kalidao.xyz/">Create</a> your first DAO with legal benefits.
        </span>
        <span>
          Then go to your <Link to="/dashboard">dashboard</Link> to manage projects and contributors.
        </span>
      </p>
    )
  }

  return (
    <Box sx={{ p: 5 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <h1>Welcome to SporosDAO Sweat Token</h1>

        {myDaos}
      </Paper>
    </Box>
  )
}
