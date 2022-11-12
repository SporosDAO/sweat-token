import { Button, CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import { useGetProposals, findProcessableProposals } from '../../graph/getProposals'
import ProposalCard from './components/ProposalCard'

/* eslint react-hooks/rules-of-hooks: 0 */

export default function Proposals() {
  const { chainId, daoId } = useParams()
  const cid = Number(chainId)
  const { data, error, isLoading, isSuccess } = useGetProposals({
    chainId: cid,
    daoAddress: daoId,
    queryOptions: {
      // refetch proposal list every 5 seconds
      refetchInterval: 5000
    }
  })
  let proposals: any[] = []
  if (isSuccess) {
    proposals = data
  }

  const processable = findProcessableProposals(proposals)
  const nextProposalToProcess = processable?.length ? processable[processable.length - 1] : undefined
  const navigate = useNavigate()

  const nextPropAction = (
    <Button
      color="inherit"
      size="small"
      onClick={() => {
        navigate(`./${nextProposalToProcess.serial}`, { state: nextProposalToProcess })
      }}
    >
      Details
    </Button>
  ) as ReactNode

  return (
    <ContentBlock
      title="Proposals"
      alert={
        nextProposalToProcess && {
          text: `Proposal #${nextProposalToProcess.serial} is ready to process.`,
          type: 'info',
          action: nextPropAction
        }
      }
    >
      {isLoading ? (
        <CircularProgress data-testid="progress-icon" />
      ) : error ? (
        <Box>
          Failed to load data.
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
        <Box display="flex" flexWrap={'wrap'}>
          {proposals?.length ? (
            proposals.map((proposal: any) => <ProposalCard key={proposal.id} proposal={proposal} />)
          ) : (
            <p>This DAO has no proposals yet.</p>
          )}
        </Box>
      )}
    </ContentBlock>
  )
}
