import { Button, CircularProgress, Fab } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetProjects } from '../../graph/getProjects'
import ProjectCard from './components/ProjectCard'

export default function Projects() {
  const { chainId, daoId } = useParams()

  const { projects, error, isLoading } = useGetProjects(chainId, daoId)
  return (
    <ContentBlock title="Projects">
      <Box display="flex" sx={{ margin: '0 0 20px 0' }} justifyContent="right">
        <Fab variant="extended" color="primary" aria-label="proposeProject" href="projects/propose">
          <Add />
          Propose Project
        </Fab>
      </Box>
      {isLoading && <CircularProgress />}
      {!isLoading && error && (
        <Box>
          Failed to load data.{' '}
          <Button onClick={(e) => e.preventDefault()} aria-label="retry">
            Retry
          </Button>
        </Box>
      )}
      <Box display="flex" flexWrap={'wrap'}>
        {projects &&
          projects.length > 0 &&
          projects.map((project: any) => <ProjectCard key={project['projectID']} project={project} />)}
        {!isLoading && projects && projects.length === 0 && <p>This DAO has no projects yet.</p>}
      </Box>
    </ContentBlock>
  )
}
