import { Button, CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetProjects } from '../../graph/getProjects'
import ProjectCard from './components/ProjectCard'

export default function Projects() {
  const { chainId, daoId } = useParams()

  const cid = Number(chainId)
  const { projects, error, isLoading } = useGetProjects(cid, daoId)

  return (
    <ContentBlock title="Projects" cta={{ href: 'propose', text: 'Propose Project' }}>
      {isLoading && <CircularProgress />}
      {!isLoading && error && (
        <Box>
          Failed to load data.{' '}
          <Button onClick={(e) => e.preventDefault()} aria-label="retry">
            Retry
          </Button>
        </Box>
      )}
      <Box display="flex" data-testid="projects-box" sx={{ justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
        {projects &&
          projects.length > 0 &&
          projects.map((project: any) => <ProjectCard key={project['projectID']} project={project} />)}
        {!isLoading && projects && projects.length === 0 && (
          <Typography sx={{ margin: 2 }}>This DAO has no projects yet.</Typography>
        )}
      </Box>
    </ContentBlock>
  )
}
