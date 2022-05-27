import { Box, CircularProgress, Grid, List, ListItem, Paper, SxProps, Theme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listDaos } from '../../api'
import { DaoDto } from '../../api/openapi'
import ContentBlock from '../../components/ContentBlock'
import { PageLayout } from '../../layout/Page'

export default function Landing() {
  const [loading, setLoading] = useState(false)
  const [publicDaos, setPublicDaos] = useState<DaoDto[]>()

  useEffect(() => {
    if (publicDaos !== undefined) return
    if (loading) return
    setLoading(true)
    listDaos()
      .then((daos: DaoDto[]) => {
        setPublicDaos(daos)
      })
      .finally(() => setLoading(false))
  })

  const blockStyle: SxProps<Theme> = {
    m: 1,
    ml: 0,
    p: 2,
    minHeight: '12em'
  }

  return (
    <PageLayout withDrawer={false}>
      <ContentBlock>
        <h1>Welcome to SporosDAO Sweat Token</h1>
      </ContentBlock>

      <Grid container>
        <Grid item lg={6}>
          <ContentBlock sx={blockStyle} title="Public DAOs">
            {loading ? (
              <CircularProgress />
            ) : publicDaos && publicDaos.length ? (
              <List>
                {(publicDaos || []).map((dao) => (
                  <ListItem key={dao.daoId}>
                    <Link to={`dao/${dao.daoId}/dashboard`}>{dao.name}</Link>
                  </ListItem>
                ))}
              </List>
            ) : (
              <p>No public DAOs yet.</p>
            )}
          </ContentBlock>
        </Grid>
        <Grid item lg={6}>
          <ContentBlock sx={{ ...blockStyle, ml: 1, mr: 0 }} title="Create a DAOs">
            <p>
              <span>
                <a href="https://app.kalidao.xyz/">Create</a> your first DAO with legal benefits.
              </span>
              <span>
                Then go to your <Link to="/dashboard">dashboard</Link> to manage projects and contributors.
              </span>
            </p>
          </ContentBlock>
        </Grid>
      </Grid>
    </PageLayout>
  )
}
