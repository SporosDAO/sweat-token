import { Card, CardContent, CardActions } from '@mui/material'
import { Button, Typography, Link } from '@mui/material'
import { useEnsName, useAccount } from 'wagmi'
import { Work, Launch, HourglassTop, HourglassDisabled } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { Key } from 'react'
import ReactMarkdown from 'react-markdown'
import LabeledValue from '../../../components/LabeledValue'

export default function ProjectCard(props: any) {
  const { chainId, daoId } = useParams()
  const { project } = props
  const { manager, projectID, budget, goals } = project

  const ensNameResult = useEnsName({ address: manager, chainId: Number(1), cacheTime: 60_000 })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const deadline = new Date()
  deadline.setTime(project['deadline'] * 1000)
  const deadlineString = deadline.toLocaleString()
  const isExpired = deadline < new Date()
  const { address: userAddress } = useAccount()
  const isManager = userAddress === manager

  const navigate = useNavigate()

  return (
    <Card
      sx={{ margin: '8px', width: '48.5%', display: 'flex', flexDirection: 'column' }}
      data-testid={projectID}
      raised={true}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography>#{projectID}</Typography>
        {goals &&
          goals.map((goal: { goalTitle: string; goalDescription: string; goalLink: string }, idx: Key) => (
            <div key={idx}>
              <Typography variant="h5" component="div">
                {goal.goalTitle}
              </Typography>
              <Link href={goal.goalLink} sx={{ fontSize: 14 }} target="_blank" rel="noopener" color="text.secondary">
                Tracking Link
              </Link>
              {goal.goalDescription && (
                <LabeledValue label="Project Description">
                  <ReactMarkdown>{goal.goalDescription}</ReactMarkdown>
                </LabeledValue>
              )}
            </div>
          ))}
        <LabeledValue label="Budget">{budget}</LabeledValue>
        <LabeledValue label="Deadline">{deadlineString}</LabeledValue>
        <LabeledValue label="Manager Address">{manager}</LabeledValue>
        {ensName ? <LabeledValue label="Manager ENS">{ensName}</LabeledValue> : <></>}
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
            data-testid={`tribute-button-${projectID}`}
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
          color="secondary"
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
