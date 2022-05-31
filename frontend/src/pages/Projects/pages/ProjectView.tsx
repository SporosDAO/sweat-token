import { AccountCircle } from '@mui/icons-material'
import { Chip, CircularProgress, Stack } from '@mui/material'
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

const ProjectOverview = ({ project }: { project: ProjectDto }) => {
  const status = project.status ? project.status.toUpperCase() : ''
  return (
    <ContentBlock title={project.name}>
      <Stack direction="row" justifyContent="space-between" spacing={1}>
        <Box>
          <p>{project.description || 'Description not provided.'}</p>
          <Chip
            variant="outlined"
            color="info"
            avatar={<AccountCircle color="info" />}
            label={`0x${project.ownerId.substring(0, 6)}..`}
          />
        </Box>
        <Box>
          <Chip label={status} color={status === 'OPEN' ? 'success' : 'primary'} variant="outlined" />
          <br />
          deadline {formatDateFromNow(project.deadline)}
          <br />
          {formatCurrency(project.budgetAllocation)} of {formatCurrency(project.budget)}
        </Box>
      </Stack>
    </ContentBlock>
  )
}

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
    loadProject(daoId, projectId)
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
      <ProjectOverview project={project} />
      <TaskList onChange={onTaskChange} project={project} />
    </Stack>
  ) : (
    <Box>
      Failed to load project. <LinkDao daoId={daoId}>Back to projects</LinkDao>
    </Box>
  )
}
