import { Button, CircularProgress, List } from '@mui/material'
import { Box } from '@mui/system'
import { useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetProposals } from '../../graph/getProposals'
import ProposalCard from './components/ProposalCard'

/* eslint react-hooks/rules-of-hooks: 0 */

export default function Proposals() {
  const { chainId, daoId } = useParams()
  const cid = Number(chainId)
  const { data, error, isLoading, isSuccess } = useGetProposals(cid, daoId)
  let proposals: any[] = []
  if (isSuccess) {
    proposals = data
    console.debug({ proposals })
  }
  return (
    <ContentBlock title="Proposals">
      {isLoading ? (
        <CircularProgress data-testid="progress-icon" />
      ) : error ? (
        <Box>
          Failed to load data.{' '}
          <Button
            data-testid="retry-btn"
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
          {proposals?.length ? (
            <List>
              {proposals.map((proposal: any) => (
                <ProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </List>
          ) : (
            <p>This DAO has not had any proposals yet.</p>
          )}
        </Box>
      )}
    </ContentBlock>
  )
}
