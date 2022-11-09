import { Launch, ThumbDown, ThumbUp } from '@mui/icons-material'
import { Link, Button, Card, CardActions, CardContent, Typography, Box, Grid } from '@mui/material'
import { ethers } from 'ethers'
import { useLocation, useParams } from 'react-router-dom'
import { chain, useEnsName } from 'wagmi'
import CircularProgressWithLabel from '../../components/CircularProgressWithLabel'
import LinearProgressWithLabel from '../../components/LinearProgressWithLabel'
import ContentBlock from '../../components/ContentBlock'
import ReactMarkdown from 'react-markdown'
import { AbiCoder } from 'ethers/lib/utils'
import VotesTable from './components/VotesTable'
import Web3SubmitDialog from '../../components/Web3SubmitDialog'
import { useState } from 'react'
import KALIDAO_ABI from '../../abi/KaliDAO.json'

function LabelValue(props: { label: string; children: React.ReactNode }): JSX.Element {
  const { label, children } = props
  return (
    <Box sx={{ mt: 1 }}>
      <Typography sx={{ fontWeight: 'bold', mt: 1 }}>{label}:</Typography>
      <Typography>{children}</Typography>
    </Box>
  )
}

export default function ProposalDetails(props: any) {
  const { chainId, daoId } = useParams()
  const cid = Number(chainId)

  const location = useLocation()
  const proposal = location?.state as any
  const {
    serial,
    proposer,
    proposalType,
    sponsor,
    sponsored,
    cancelled,
    status,
    votes,
    creationTime,
    votingStarts,
    accounts,
    payloads,
    dao
  } = proposal || {}
  const { votingPeriod, quorum, token } = dao
  const { totalSupply, symbol } = token
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

  const ensNameResult = useEnsName({ address: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''

  const PM_CONTRACT = '0x9f0ad778385a2c688533958c6ada56f201ffc246'

  let knownProposalType = true
  let isProjectProposal = true

  if (proposalType === 'EXTENSION') {
    if (accounts?.length && accounts[0] === PM_CONTRACT) {
      isProjectProposal = true
    } else {
      knownProposalType = false
    }
  } else if (proposalType !== 'MINT') {
    knownProposalType = false
  }

  let manager, budgetE18, dateInSecs, goalString

  try {
    const abiCoder: AbiCoder = ethers.utils.defaultAbiCoder as AbiCoder
    ;[, manager, budgetE18, dateInSecs, goalString] = abiCoder.decode(
      ['uint256', 'address', 'uint256', 'uint256', 'string'],
      payloads[0]
    )
  } catch (e) {
    console.error('Error while encoding project proposal', e)
  }
  const projectDeadline = new Date(dateInSecs * 1000).toUTCString()
  const goals = JSON.parse(goalString)
  const { goalTitle, goalDescription, goalLink } = goals[0] || {}
  let budget = ethers.utils.formatEther(budgetE18)
  budget = new Intl.NumberFormat().format(Number(budget))

  const managerEnsNameResult = useEnsName({ address: proposer, chainId: chain.mainnet.id, cacheTime: 60_000 })
  const managerEnsName = !managerEnsNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''

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

  console.debug({ votes })

  return isProjectProposal ? (
    <ContentBlock title={`Project Management`}>
      <Box display="flex" flexWrap={'wrap'}>
        <Card sx={{ margin: '8px' }}>
          <CardContent>
            <Typography color="subtitle1">Proposal #{serial}</Typography>
            <Typography variant="h4" color="accent">
              {goalTitle}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              By {proposer}
            </Typography>
            <Typography color="text.secondary">{ensName}</Typography>
            <LabelValue label="Manager">
              {manager} {managerEnsName}
            </LabelValue>
            <LabelValue label="Budget">
              {budget} {symbol}
            </LabelValue>
            <LabelValue label="Project Deadline">{projectDeadline}</LabelValue>
            <LabelValue label="Project Description">
              <ReactMarkdown>{goalDescription}</ReactMarkdown>
            </LabelValue>
            <LabelValue label="Progress Tracking">
              <Link href="{goalLink}">{goalLink}</Link>
            </LabelValue>
          </CardContent>
        </Card>
        <Card sx={{ margin: '8px' }}>
          <CardContent>
            <LabelValue label="Submitted On">{creationTimeString}</LabelValue>
            {sponsored ? (
              <>
                <LabelValue label="Voting Start Date">{votingStartsString}</LabelValue>
                <LabelValue label="Voting Deadline">{voteDeadlineString}</LabelValue>
                {sponsor ? (
                  <LabelValue label="Sponsor">{sponsor}</LabelValue>
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
                  <ThumbDown color="error" />{' '}
                  <CircularProgressWithLabel color="error" value={100 - votesForPercentage} />
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
      </Box>
      <Box display="flex" flexWrap={'wrap'} sx={{ margin: '8px' }}>
        <VotesTable votes={votes} />
      </Box>
      {isDialogOpen && (
        <Web3SubmitDialog open={isDialogOpen} onClose={onDialogClose} txInput={txInput} hrefAfterSuccess="./" />
      )}
    </ContentBlock>
  ) : (
    <Box display="flex" flexWrap={'wrap'} sx={{ margin: '8px' }}>
      <Typography color="error.main">
        Proposal type {proposalType} not supported. Please try Kali DAO or another front end.
      </Typography>
    </Box>
  )
}
