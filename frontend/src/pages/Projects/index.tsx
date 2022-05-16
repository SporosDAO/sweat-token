import { CircularProgress, Grid, List, ListItem } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProjectDto } from '../../api/openapi'
import { findProjects } from '../../api'
import ContentBlock from '../../components/ContentBlock'
import useDao from '../../context/DaoContext'

const ProjectsList = () => {
  const [projects, setProjects] = useState<ProjectDto[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const { dao } = useDao()

  useEffect(() => {
    if (!dao) return
    if (projects !== undefined) return
    if (loading) return
    setLoading(true)
    findProjects({
      daoId: dao?.daoId
    })
      .then((projects: ProjectDto[]) => {
        setProjects(projects)
      })
      .finally(() => setLoading(false))
  }, [dao, loading, projects])

  return loading ? (
    <CircularProgress />
  ) : projects && projects.length ? (
    <List>
      <ListItem></ListItem>
    </List>
  ) : (
    <Box>
      No projects yet. <Link to="add">Add a new project</Link>
    </Box>
  )
}

export default function Projects() {
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
