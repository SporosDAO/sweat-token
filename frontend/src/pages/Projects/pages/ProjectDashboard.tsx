import { CircularProgress, Grid, List, ListItem } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { findProjects } from '../../../api'
import { ProjectDto } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useDao from '../../../context/DaoContext'
import { LinkProject } from '../../../context/PageContext'

const ProjectsList = () => {
  const [projects, setProjects] = useState<ProjectDto[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const { daoId } = useDao()

  useEffect(() => {
    if (!daoId) return
    if (projects !== undefined) return
    if (loading) return
    setLoading(true)
    findProjects({ daoId })
      .then((projects: ProjectDto[]) => {
        setProjects(projects)
      })
      .finally(() => setLoading(false))
  }, [daoId, loading, projects])

  return loading ? (
    <CircularProgress />
  ) : projects && projects.length ? (
    <List>
      {projects.map((project) => (
        <ListItem key={project.projectId}>
          <LinkProject project={project}>{project.name}</LinkProject>
        </ListItem>
      ))}
    </List>
  ) : (
    <Box>
      No projects yet.{' '}
      <LinkProject add daoId={daoId}>
        Add a new project
      </LinkProject>
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
        <ContentBlock title="Tasks"></ContentBlock>
      </Grid>
    </Grid>
  )
}
