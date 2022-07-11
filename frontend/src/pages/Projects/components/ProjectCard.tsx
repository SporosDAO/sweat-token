import { Card, CardContent, CardActions } from '@mui/material'
import { Button, Typography, ListItem } from '@mui/material'
import { useEnsName, useEnsAvatar } from 'wagmi'
import { Work, Launch } from '@mui/icons-material'
import { useParams } from 'react-router-dom'

export default function ProjectCard(props: any) {
  const { chainId, daoId } = useParams()

  const project = props.project

  const manager = project['manager']
  const ensNameResult = useEnsName({ address: manager, chainId: Number(1), cacheTime: 60_000 })
  console.debug('useEnsName', { ensNameResult })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const ensAvatarResult = useEnsAvatar({ addressOrName: manager, chainId: Number(1), cacheTime: 60_000 })
  console.debug('useEnsAvatar', { ensAvatarResult })
  const ensAvatar = !ensAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''

  return (
    <ListItem key={project['projectID']}>
      <Card sx={{ minWidth: 400 }} raised={true}>
        <CardContent>
          <Typography variant="h5" component="div">
            {project['goals']}
          </Typography>
          <Typography>#{project['projectID']}</Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            budget: {project['budget']}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            deadline: {project['deadline']}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            manager: {ensName}
          </Typography>
          <div>{ensAvatar}</div>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button variant="text" endIcon={<Work />} href={`projects/${project['projectID']}/tribute`}>
            Tribute
          </Button>
          <Button
            variant="text"
            endIcon={<Launch />}
            href={`https://app.kali.gg/daos/${chainId}/${daoId}`}
            rel="noopener"
            target="_blank"
          >
            Kali
          </Button>
        </CardActions>
      </Card>
    </ListItem>
  )
}
