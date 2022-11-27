import { useState } from 'react'
import { ethers } from 'ethers'
import { addresses } from '../../constants/addresses'
import PM_ABI from '../../abi/ProjectManagement.json'
import { useLocation, useParams } from 'react-router-dom'
import { Box, TextField, Button, List, ListItem, Alert, Typography, Link, InputAdornment } from '@mui/material'
import { FieldErrors, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import Web3SubmitDialog from '../../components/Web3SubmitDialog'
import { ErrorMessage } from '@hookform/error-message'
import { useAccount } from 'wagmi'
import { Key } from 'react'
import { useGetDAO } from '../../graph/getDAO'
import { useConnectModal } from '@rainbow-me/rainbowkit'

export default function ProjectTribute() {
  const { chainId, daoId, projectId } = useParams()

  // Web3SubmitDialog state vars
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const location = useLocation()

  const project = location?.state as any

  const { manager, budget, goals, deadline } = project || {}

  const { openConnectModal } = useConnectModal()

  const { address: userAddress, isDisconnected } = useAccount()

  const isManager = userAddress === manager

  const deadlineDate = new Date()
  deadlineDate.setTime(deadline * 1000)
  const deadlineString = deadlineDate.toUTCString()
  const isExpired = deadlineDate < new Date()

  const cid = Number(chainId)

  const { data: myDao } = useGetDAO(cid, daoId)

  const hasBudget = Number(budget) > 0

  const pmAddress = addresses[cid]['extensions']['projectmanagement']
  const formResult = useForm<ProjectTributeFormValues>({ criteriaMode: 'all' })
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = formResult

  const callArgs = ['uint256', 'address', 'uint256', 'string']

  const contractInfo = {
    addressOrName: pmAddress,
    chainId: cid,
    contractInterface: PM_ABI,
    functionName: 'callExtension'
  }

  const [txInput, setTxInput] = useState(undefined as any)

  type ProjectTributeFormValues = {
    contributorAddress: string
    mintAmount: string
    tributeTitle: string
    tributeLink: string
  }

  const onSubmit: SubmitHandler<ProjectTributeFormValues> = (formData) => {
    const { contributorAddress, mintAmount, tributeTitle, tributeLink } = formData

    const tribute = [{ tributeTitle, tributeLink }]
    const tributeString = JSON.stringify(tribute)

    const abiCoder = ethers.utils.defaultAbiCoder
    let payload
    try {
      payload = abiCoder.encode(callArgs, [
        projectId, // project id of the just activated project
        contributorAddress, // address of contributor to receive DAO tokens
        ethers.utils.parseEther(mintAmount), // mint amount in whole token units similar to Ether with 18 decimal places
        tributeString // reference to tribute that contributor makes to DAO in exchange for DAO tokens
      ])
    } catch (e) {
      console.error('Error while encoding project tribute', e)
      return
    }

    setTxInput({
      ...contractInfo,
      args: [daoId, [payload]]
    })
    setIsDialogOpen(true)
  } // onSubmit

  const onSubmitError: SubmitErrorHandler<ProjectTributeFormValues> = (formErrors: FieldErrors) => {
    console.error({ formErrors })
  }

  const onDialogClose = async () => {
    setIsDialogOpen(false)
  }

  if (!chainId || !daoId || !projectId || !manager) {
    return <Navigate replace to="/" />
  }

  return (
    <Box
      sx={{
        maxWidth: 400
      }}
    >
      {isDisconnected && (
        <Alert severity="error" sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
          Your wallet has been disconnected. Click{' '}
          <Link onClick={openConnectModal} color={'#0000EE'} sx={{ cursor: 'pointer' }}>
            here
          </Link>{' '}
          to connect again.
        </Alert>
      )}
      {!isManager && !isDisconnected && (
        <Alert severity="error" sx={{ overflow: 'hidden', wordBreak: 'break-word' }}>
          You are not the manager of this project. Your wallet account "{userAddress}" does not match the manager
          account {manager}.
        </Alert>
      )}
      {isManager && !isDisconnected && (
        <>
          <Alert severity="info">
            Submit tribute for project #{projectId}
            {goals &&
              goals.map((goal: { goalTitle: string; goalLink: string }, idx: Key) => (
                <div key={idx}>
                  <Typography variant="h5" component="div">
                    {goal.goalTitle}
                  </Typography>
                  <Link
                    href={goal.goalLink}
                    sx={{ fontSize: 14 }}
                    target="_blank"
                    rel="noopener"
                    color="text.secondary"
                  >
                    Tracking Link
                  </Link>
                </div>
              ))}
          </Alert>
          {isExpired && <Alert severity="error">This project deadline expired on {deadlineString}.</Alert>}
          {!hasBudget && <Alert severity="error">This project has no budget left.</Alert>}
          <List component="form" onSubmit={handleSubmit(onSubmit, onSubmitError)}>
            <ListItem>
              <TextField
                label="Contributor"
                helperText="ETH L1/L2 address: 0x..."
                variant="filled"
                fullWidth
                {...register('contributorAddress', { required: 'Contributor address is required.' })}
              />
            </ListItem>
            <ListItem>
              <ErrorMessage as={<Alert severity="error" />} errors={errors} name="contributorAddress" />
            </ListItem>
            <ListItem>
              <TextField
                label="Mint Amount"
                helperText="Amount in DAO sweat tokens to mint to contributor"
                variant="filled"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">{myDao?.token?.symbol}</InputAdornment>
                }}
                fullWidth
                {...register('mintAmount', {
                  required: 'Mint amount is required.',
                  min: { value: 0, message: 'Mint value must be positive.' },
                  max: { value: budget, message: `Mint value must be within budget: ${budget}.` }
                })}
              />
            </ListItem>
            <ListItem>
              <ErrorMessage as={<Alert severity="error" />} errors={errors} name="mintAmount" />
            </ListItem>
            <ListItem>
              <TextField
                label="Tribute Title"
                helperText="Describe the tribute to the project"
                variant="filled"
                fullWidth
                {...register('tributeTitle', { required: 'Tribute title is required.' })}
              ></TextField>
            </ListItem>
            <ListItem>
              <ErrorMessage as={<Alert severity="error" />} errors={errors} name="tributeTitle" />
            </ListItem>
            <ListItem>
              <TextField
                type="url"
                label="Tribute Reference Link"
                helperText="URL referencing tribute details."
                variant="filled"
                fullWidth
                {...register('tributeLink')}
              />
            </ListItem>
            <ListItem>
              <ErrorMessage as={<Alert severity="error" />} errors={errors} name="tributeLink" />
            </ListItem>
            <ListItem>
              <Button type="submit" variant="contained" data-testid="submit-button">
                Submit
              </Button>
            </ListItem>
          </List>
        </>
      )}
      {isDialogOpen && ( // use check to prevent Web3SubmitDialog rendering before open due to wagmi bug in updating config when contract args update with form data
        <Web3SubmitDialog open={isDialogOpen} onClose={onDialogClose} txInput={txInput} hrefAfterSuccess=".." />
      )}
    </Box>
  )
}
