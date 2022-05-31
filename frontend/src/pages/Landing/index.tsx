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
        <h1>Your DevCo DAOs</h1>

        {publicDaos && publicDaos.length ? (
          <List>
            {(publicDaos || []).map((dao) => (
              <ListItem key={dao.daoId}>
                <Link to={`dao/${dao.daoId}/dashboard`}>{dao.name}</Link>
              </ListItem>
            ))}
          </List>
        ) : (
          <p>
            <span>Loading your DAOs...</span>
          </p>
        )}
        <p>
          <a href="https://app.kalidao.xyz/">Create</a> a new DAO with legal benefits via KaliDAO. Once created it will
          show up in your list of managed DAOs above.
        </p>
      </Paper>
    </Box>
  )
}
