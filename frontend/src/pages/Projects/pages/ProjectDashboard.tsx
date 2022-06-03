import { Stack, Button, CircularProgress, Grid, List, ListItem } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { findProjects } from '../../../api'
import { ProjectDto } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useDao from '../../../context/DaoContext'
import { LinkProject } from '../../../context/PageContext'
import { formatCurrency, formatDateFromNow } from '../../../util'

const ProjectsList = () => {
  const [projects, setProjects] = useState<ProjectDto[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [failed, setFailed] = useState<boolean>(false)
  const { daoId } = useDao()

  useEffect(() => {
    if (!daoId) return
    if (projects !== undefined) return
    if (failed) return
    if (loading) return
    setLoading(true)
    findProjects({ daoId })
      .then((projects: ProjectDto[]) => {
        setProjects(projects)
      })
      .catch((e) => {
        setFailed(true)
        console.error(`Request failed: ${e.stack}`)
      })
      .finally(() => setLoading(false))
  }, [daoId, failed, loading, projects])

  return (
    <Box>
      {failed ? (
        <p>
          Failed to load.{' '}
          <Button onClick={() => setFailed(false)} aria-label="retry">
            Retry
          </Button>
        </p>
      ) : loading ? (
        <CircularProgress />
      ) : projects && projects.length ? (
        <List>
          {(projects || []).map((project) => (
            <ListItem key={project.projectId}>
              <Stack direction="row" spacing={1}>
                <LinkProject project={project}>{project.name}</LinkProject>

                <div>deadline in {formatDateFromNow(project.deadline)},</div>
                <div>budget {formatCurrency(project.budget)}</div>
              </Stack>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box>No projects yet. </Box>
      )}

      <Box textAlign="right">
        <LinkProject add daoId={daoId}>
          Create new project
        </LinkProject>
      </Box>
    </Box>
  )
}

export default function ProjectDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <ContentBlock title="Active Projects">
          <ProjectsList />
        </ContentBlock>
      </Grid>
      <Grid item xs={12} lg={6}>
        <ContentBlock title="Tasks">
          <p>Coming soon..</p>
        </ContentBlock>
      </Grid>
    </Grid>
  )
}
