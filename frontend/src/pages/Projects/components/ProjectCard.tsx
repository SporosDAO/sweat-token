import { Launch, Work } from '@mui/icons-material'
import { Button, Card, CardActions, CardContent, Link, ListItem, Typography } from '@mui/material'
import { Key } from 'react'
import { useParams } from 'react-router-dom'
import { useEnsAvatar, useEnsName } from 'wagmi'

export default function ProjectCard(props: any) {
  const { chainId, daoId } = useParams()

  const project = props.project
  console.debug({ project })

  const manager = project['manager']
  const ensNameResult = useEnsName({ address: manager, chainId: Number(1), cacheTime: 60_000 })
  console.debug('useEnsName', { ensNameResult })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const ensAvatarResult = useEnsAvatar({ addressOrName: manager, chainId: Number(1), cacheTime: 60_000 })
  console.debug('useEnsAvatar', { ensAvatarResult })
  const ensAvatar = !ensAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''
  const deadline = new Date()
  deadline.setTime(project['deadline'] * 1000)
  const deadlineString = deadline.toUTCString()

  return (
    <ListItem>
      <Card sx={{ minWidth: 400 }} raised={true}>
        <CardContent>
          <Typography>#{project['projectID']}</Typography>
          {project['goals'] &&
            project['goals'].map((goal: { goalTitle: string; goalLink: string }, idx: Key) => (
              <div key={idx}>
                <Typography variant="h5" component="div">
                  {goal.goalTitle}
                </Typography>
                <Link href={goal.goalLink} target="_blank" rel="noopener" color="text.secondary">
                  Tracking Link
                </Link>
              </div>
            ))}
          <Typography color="text.secondary" gutterBottom>
            Budget: {project['budget']}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Deadline: {deadlineString}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Manager address: {manager}
          </Typography>
          {ensName ? (
            <div>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Manager ENS: {ensName}
              </Typography>
              <div>{ensAvatar}</div>
            </div>
          ) : (
            <div />
          )}
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
