import { CircularProgress, Grid, List, ListItem } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProjectDto } from '../../../api/openapi'
import { findProjects, loadProject } from '../../../api'
import ContentBlock from '../../../components/ContentBlock'
import useDao from '../../../context/DaoContext'
import { getDaoProjectUrl } from '../../../constants'
import usePage from '../../../context/PageContext'

export default function ProjectView() {
  const [project, setProject] = useState<ProjectDto>()
  const [loading, setLoading] = useState<boolean>(false)

  const { setTitle } = usePage()
  const { daoId } = useDao()
  const { projectId } = useParams()

  useEffect(() => {
    if (!daoId) return
    if (!projectId) return
    if (project !== undefined) return

    if (loading) return
    setLoading(true)
    loadProject(projectId)
      .then((project: ProjectDto) => {
        setProject(project)
      })
      .finally(() => setLoading(false))
  }, [daoId, loading, project, projectId])

  useEffect(() => {
    if (!project) return
    setTitle(project.name)
  }, [project, setTitle])

  return loading ? (
    <CircularProgress />
  ) : project ? (
    <ContentBlock title={project.name}>
      <p>description: {project.description}</p>
      <p>deadline: {project.deadline}</p>
      <p>budget: {project.budget}</p>
    </ContentBlock>
  ) : (
    <Box>
      Failed to load project. <Link to={getDaoProjectUrl(daoId || '', 'add')}>Back to projects</Link>
    </Box>
  )
}
