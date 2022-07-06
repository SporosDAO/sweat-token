import { Button, CircularProgress, Fab, Card, CardContent, Typography, List, ListItem } from '@mui/material'
import { AddIcon } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetProjects } from '../../graph/getProjects'
import { useEnsName, useEnsAvatar } from 'wagmi'

/* eslint react-hooks/rules-of-hooks: 0 */

export default function Projects() {
  const { chainId, daoId } = useParams()

  const { data, error, isLoading, isSuccess } = useGetProjects(chainId, daoId)
  const projects = data?.projects
  console.debug({ projects })
  const peopleEns: { [address: string]: { avatar: any; name: any } } = {}
  if (projects) {
    projects.map((project: any) => {
      const manager = project['manager']
      peopleEns[manager] = {
        name: useEnsName({ address: manager, chainId: Number(1), cacheTime: 60_000 }).data,
        avatar: useEnsAvatar({ addressOrName: manager, chainId: Number(1), cacheTime: 60_000 }).data
      }
    })
  }

  return (
    <ContentBlock title="Projects">
      <Fab variant="extended" color="primary" aria-label="proposeProject">
        <AddIcon />
        Propose a New Project
      </Fab>
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
                <ListItem key={project['projectId']}>
                  <Card sx={{ minWidth: 400 }} raised={true}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {peopleEns[project['manager']]?.name}
                      </Typography>
                      <div>{peopleEns[project['manager']]?.avatar}</div>
                      <Typography>#{project['projectId']}</Typography>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        budget: {project['budget']}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        deadline: {project['deadline']}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        goals: {project['goals']}
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
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
