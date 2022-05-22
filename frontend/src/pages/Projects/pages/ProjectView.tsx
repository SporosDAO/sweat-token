import { CircularProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadProject } from '../../../api'
import { ProjectDto } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useDao from '../../../context/DaoContext'
import usePage, { LinkDao } from '../../../context/PageContext'
import { formatCurrency, formatDateFromNow } from '../../../util'
import TaskList from '../components/TaskList'

export default function ProjectView() {
  const [project, setProject] = useState<ProjectDto>()
  const [loading, setLoading] = useState<boolean>(false)

  const { daoId } = useDao()
  const { projectId } = useParams()
  const { setTitle } = usePage()

  useEffect(() => {
    if (!project) return
    setTitle(project.name)
  }, [project, setTitle])

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
  }, [daoId, loading, project, projectId, setTitle])

  const onTaskChange = () => {
    setProject(undefined)
  }

  return loading ? (
    <CircularProgress />
  ) : project ? (
    <Stack direction={'column'}>
      <ContentBlock title={project.name}>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Box>{project.description || 'Description not provided.'}</Box>
          <Box>
            {project.status ? project.status.toUpperCase() : ''}
            <br />
            deadline {formatDateFromNow(project.deadline)}
            <br />
            {formatCurrency(project.budgetAllocation)} of {formatCurrency(project.budget)}
          </Box>
        </Stack>
      </ContentBlock>
      <TaskList onChange={onTaskChange} project={project} />
    </Stack>
  ) : (
    <Box>
      Failed to load project. <LinkDao daoId={daoId}>Back to projects</LinkDao>
    </Box>
  )
}
