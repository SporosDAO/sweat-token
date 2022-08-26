import { Card, CardContent, CardActions } from '@mui/material'
import { Button, Typography, Link } from '@mui/material'
import { useEnsName, useEnsAvatar, useAccount } from 'wagmi'
import { Work, Launch, HourglassTop, HourglassDisabled } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { Key } from 'react'

export default function ProjectCard(props: any) {
  const { chainId, daoId } = useParams()
  const { project } = props
  const { manager, projectID, budget, goals } = project

  const ensNameResult = useEnsName({ address: manager, chainId: Number(1), cacheTime: 60_000 })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const ensAvatarResult = useEnsAvatar({ addressOrName: manager, chainId: Number(1), cacheTime: 60_000 })
  const ensAvatar = !ensAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''
  const deadline = new Date()
  deadline.setTime(project['deadline'] * 1000)
  const deadlineString = deadline.toUTCString()
  const isExpired = deadline < new Date()
  const { address: userAddress } = useAccount()
  const isManager = userAddress === manager

  const navigate = useNavigate()

  return (
    <Card sx={{ margin: '8px', width: '48.5%' }} data-testid={projectID} raised={true}>
      <CardContent>
        <Typography>#{projectID}</Typography>
        {goals &&
          goals.map((goal: { goalTitle: string; goalLink: string }, idx: Key) => (
            <div key={idx}>
              <Typography variant="h5" component="div">
                {goal.goalTitle}
              </Typography>
              <Link href={goal.goalLink} sx={{ fontSize: 14 }} target="_blank" rel="noopener" color="text.secondary">
                Tracking Link
              </Link>
            </div>
          ))}
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Budget: {budget}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Deadline: {deadlineString}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Manager Address: {manager}
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
        {isExpired ? (
          <Button disabled variant="text" endIcon={<HourglassDisabled />}>
            Expired
          </Button>
        ) : isManager ? (
          <Button
            variant="text"
            endIcon={<Work />}
            onClick={() => {
              navigate(`${project['projectID']}/tribute`, { state: project })
            }}
            data-testid="tribute-button"
          >
            Tribute
          </Button>
        ) : (
          <Button variant="text" endIcon={<HourglassTop />} color="success">
            Active
          </Button>
        )}
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
  )
}
