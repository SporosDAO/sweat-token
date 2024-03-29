import { ThumbUp, ThumbDown, Launch, PlayArrow } from '@mui/icons-material'
import { Card, CardContent, Typography, Box, Grid, CardActions, Button } from '@mui/material'
import { ethers } from 'ethers'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import CircularProgressWithLabel from '../../../components/CircularProgressWithLabel'
import LabeledValue from '../../../components/LabeledValue'
import LinearProgressWithLabel from '../../../components/LinearProgressWithLabel'
import Web3SubmitDialog from '../../../components/Web3SubmitDialog'
import KALIDAO_ABI from '../../../abi/KaliDAO.json'
import { useAccount } from 'wagmi'
import { knownProposalType } from '../proposalHelpers'

export default function VoteSummaryCard(props: { proposal: any }) {
  const { chainId, daoId } = useParams()
  const cid = Number(chainId)
  const { proposal, ...otherProps } = props

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
    isReadyToProcessImmediately,
    accounts,
    dao
  } = proposal || {}

  const { votingPeriod, quorum, token } = dao || {}
  const { totalSupply } = token || { totalSupply: '0' }
  const creationTimeString = new Date(Number(creationTime) * 1000).toLocaleString()
  const votingStartsString = new Date(Number(votingStarts) * 1000).toLocaleString()
  const voteDeadline = new Date((Number(votingStarts) + Number(votingPeriod)) * 1000)
  const voteDeadlineString = voteDeadline.toLocaleString()
  const now = new Date()
  const isExpired = voteDeadline < now
  // console.debug({ isExpired, now, voteDeadline, voteDeadlineString, votingStarts, votingPeriod })
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

  const { isKnown } = knownProposalType({ proposalType, accounts })

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

  function onProcess(event: any) {
    const contractInfo = {
      addressOrName: daoId,
      chainId: cid,
      contractInterface: KALIDAO_ABI,
      functionName: 'processProposal' //  ['uint256' /* proposal serial # */
    }

    setTxInput({
      ...contractInfo,
      args: [serial]
    })
    setIsDialogOpen(true)
  }

  const { address, isConnected } = useAccount()
  const canVote: boolean = useMemo(() => {
    if (isKnown && !isExpired && isConnected) {
      const userVoted = votes?.reduce(
        (result: boolean, item: { voter: string }) => result || item.voter === address,
        false
      )
      return !userVoted
    }
    return false
  }, [votes, isExpired, isKnown, isConnected, address])

  // console.debug({ canVote, votes, isExpired, isKnown, isConnected, address })

  return (
    <Card sx={{ margin: '8px' }} {...otherProps}>
      <CardContent>
        <LabeledValue data-testid="created-lv" label="Submitted On">
          {creationTimeString}
        </LabeledValue>
        {sponsored ? (
          <>
            <LabeledValue data-testid="starts-lv" label="Voting Start Date">
              {votingStartsString}
            </LabeledValue>
            <LabeledValue data-testid="deadline-lv" label="Voting Deadline">
              {voteDeadlineString}
            </LabeledValue>
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
                Voting Closed
              </Typography>
              <Typography color={status ? 'success.main' : 'text.secondary'} gutterBottom>
                {status ? 'PROPOSAL PASSED' : status === false ? 'PROPOSAL NOT PASSED' : ''}
              </Typography>
            </>
          )
        )}
        {isDialogOpen && (
          <Web3SubmitDialog open={isDialogOpen} onClose={onDialogClose} txInput={txInput} hrefAfterSuccess="./" />
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {canVote && (
          <Box sx={{ mr: 1 }}>
            <Button
              data-testid="for-button"
              variant="contained"
              endIcon={<ThumbUp />}
              sx={{ m: 1 }}
              onClick={onVoteFor}
            >
              For
            </Button>
            <Button
              data-testid="against-button"
              variant="contained"
              endIcon={<ThumbDown />}
              sx={{ mr: 1 }}
              onClick={onVoteAgainst}
            >
              Against
            </Button>
          </Box>
        )}
        {isReadyToProcessImmediately && isConnected && isKnown && (
          <Button
            data-testid="process-button"
            variant="contained"
            endIcon={<PlayArrow />}
            sx={{ m: 1 }}
            onClick={onProcess}
          >
            Process
          </Button>
        )}
        <Button
          variant="text"
          color="secondary"
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
