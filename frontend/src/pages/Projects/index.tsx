import { Button, CircularProgress, Fab, List } from '@mui/material'
import { Add } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetProjects } from '../../graph/getProjects'
import ProjectCard from './components/ProjectCard'

/* eslint react-hooks/rules-of-hooks: 0 */

export default function Projects() {
  const { chainId, daoId } = useParams()

  const { projects, error, isLoading, isSuccess } = useGetProjects(chainId, daoId)
  console.debug('useGetProjects', { projects, error, isLoading, isSuccess })
  console.debug({ projects })

  return (
    <ContentBlock title="Projects">
      <Box display="flex" justifyContent="right">
        <Fab variant="extended" color="primary" aria-label="proposeProject" href="projects/propose">
          <Add />
          Propose Project
        </Fab>
      </Box>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Box>
          Failed to load data.{' '}
          <Button
            onClick={(e) => {
              e.preventDefault()
            }}
            aria-label="retry"
          >
            Retry
          </Button>
        </Box>
      ) : (
        <Box>
          {projects && projects.length ? (
            <List>
              {projects.map((project: any) => (
                <ProjectCard key={project['projectID']} project={project} />
              ))}
            </List>
          ) : (
            <p>This DAO has no members yet.</p>
          )}
        </Box>
      )}
    </ContentBlock>
  )
}
