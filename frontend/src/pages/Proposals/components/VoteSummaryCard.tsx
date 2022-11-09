import { ThumbUp, ThumbDown, Launch } from '@mui/icons-material'
import { Card, CardContent, Typography, Box, Grid, CardActions, Button } from '@mui/material'
import { ethers } from 'ethers'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import CircularProgressWithLabel from '../../../components/CircularProgressWithLabel'
import LabeledValue from '../../../components/LabeledValue'
import LinearProgressWithLabel from '../../../components/LinearProgressWithLabel'
import Web3SubmitDialog from '../../../components/Web3SubmitDialog'
import { addresses } from '../../../constants/addresses'
import KALIDAO_ABI from '../../../abi/KaliDAO.json'

export default function VoteSummaryCard(props: any) {
  const { chainId, daoId } = useParams()
  const cid = Number(chainId)
  const { proposal } = props

  const {
    serial,
    proposalType,
    sponsor,
    sponsored,
    cancelled,
    status,
    votes,
    creationTime,
    votingStarts,
    accounts,
    dao
  } = proposal || {}

  const { votingPeriod, quorum, token } = dao || {}
  const { totalSupply } = token || { totalSupply: '0' }
  const creationTimeString = new Date(Number(creationTime) * 1000).toUTCString()
  const votingStartsString = new Date(Number(votingStarts) * 1000).toUTCString()
  const voteDeadline = new Date((Number(votingStarts) + Number(votingPeriod)) * 1000)
  const voteDeadlineString = voteDeadline.toUTCString()
  const isExpired = voteDeadline < new Date()
  const votesFor = votes?.reduce(
    (result: any, item: { vote: any; weight: any }) =>
      result + Number(item.vote ? ethers.utils.formatEther(item.weight) : 0),
    0
  )
  const votesTotal = votes?.reduce(
    (result: any, item: { vote: any; weight: any }) => result + Number(ethers.utils.formatEther(item.weight)),
    0
  )

  const votesForPercentage = votesTotal ? (votesFor * 100) / votesTotal : 0
  const totalSupplyFormatted = Number(ethers.utils.formatEther(totalSupply))
  const quorumVotesRequired = (quorum * totalSupplyFormatted) / 100
  const quorumProgress = votesTotal >= quorumVotesRequired ? 100 : (votesTotal * 100) / quorumVotesRequired

  const PM_CONTRACT = addresses[cid]['extensions']['projectmanagement']

  let knownProposalType = true

  if (proposalType === 'EXTENSION') {
    if (accounts?.length && accounts[0] === PM_CONTRACT) {
    } else {
      knownProposalType = false
    }
  } else if (proposalType !== 'MINT') {
    knownProposalType = false
  }

  // Web3SubmitDialog state vars
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [txInput, setTxInput] = useState(undefined as any)

  const onDialogClose = async () => {
    setIsDialogOpen(false)
  }

  function submitVote(approval: boolean): void {
    const contractInfo = {
      addressOrName: daoId,
      chainId: cid,
      contractInterface: KALIDAO_ABI,
      functionName: 'vote' //  ['uint256' /* proposal serial # */, 'bool' /* yes/no approval */]
    }

    setTxInput({
      ...contractInfo,
      args: [serial, approval]
    })
    setIsDialogOpen(true)
  }

  function onVoteFor(event: any) {
    submitVote(true)
  }

  function onVoteAgainst(event: any) {
    submitVote(false)
  }

  return (
    <Card sx={{ margin: '8px' }}>
      <CardContent>
        <LabeledValue label="Submitted On">{creationTimeString}</LabeledValue>
        {sponsored ? (
          <>
            <LabeledValue label="Voting Start Date">{votingStartsString}</LabeledValue>
            <LabeledValue label="Voting Deadline">{voteDeadlineString}</LabeledValue>
            {sponsor ? (
              <LabeledValue label="Sponsor">{sponsor}</LabeledValue>
            ) : (
              <Typography color="text.secondary" gutterBottom>
                Submitted by a DAO member.
              </Typography>
            )}
          </>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography color="warning.main" gutterBottom>
              NOT SPONSORED.
            </Typography>
            <Typography variant="subtitle2" color="warning.main" gutterBottom>
              Submitted by a non-member. Requires member sponsorship.
            </Typography>
          </Box>
        )}
        {cancelled && (
          <Typography color="text.secondary" gutterBottom>
            CANCELLED
          </Typography>
        )}
        {!isExpired && votes?.length ? (
          <Grid container spacing={2} minHeight={80}>
            <Grid display="flex" justifyContent="center" alignItems="center" sx={{ pl: 4 }}>
              <ThumbUp color="success" /> <CircularProgressWithLabel color="success" value={votesForPercentage} />
            </Grid>
            <Grid display="flex" justifyContent="center" alignItems="center" sx={{ pl: 4 }}>
              <ThumbDown color="error" /> <CircularProgressWithLabel color="error" value={100 - votesForPercentage} />
            </Grid>
          </Grid>
        ) : (
          <></>
        )}
        {!isExpired ? (
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={quorumProgress} />
            <Typography color="text.secondary" gutterBottom>
              Quorum {quorumProgress < 100 ? 'Not Reached' : 'Reached'}
            </Typography>
            <Typography color="text.primary" gutterBottom>
              ACTIVE
            </Typography>
          </Box>
        ) : (
          sponsored && (
            <>
              <Typography color="text.secondary" gutterBottom>
                CLOSED
              </Typography>
              <Typography color={status ? 'success.main' : 'text.secondary'} gutterBottom>
                {status ? 'PASSED' : 'NOT PASSED'}
              </Typography>
            </>
          )
        )}
        {isDialogOpen && (
          <Web3SubmitDialog open={isDialogOpen} onClose={onDialogClose} txInput={txInput} hrefAfterSuccess="./" />
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ mr: 1 }}>
          <Button
            variant="contained"
            disabled={!knownProposalType || isExpired}
            endIcon={<ThumbUp />}
            sx={{ m: 1 }}
            onClick={onVoteFor}
          >
            Vote For
          </Button>
          <Button
            variant="contained"
            disabled={!knownProposalType || isExpired}
            endIcon={<ThumbDown />}
            sx={{ mr: 1 }}
            onClick={onVoteAgainst}
          >
            Vote Against
          </Button>
        </Box>
        <Button
          variant="text"
          endIcon={<Launch />}
          href={`https://app.kali.gg/daos/${chainId}/${daoId}/proposals/${serial}`}
          rel="noopener"
          target="_blank"
        >
          Kali
        </Button>
      </CardActions>
    </Card>
  )
}
