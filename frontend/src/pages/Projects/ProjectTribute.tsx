import { useState } from 'react'
import { ethers } from 'ethers'
import { addresses } from '../../constants/addresses'
import PM_ABI from '../../abi/ProjectManagement.json'
import { useLocation, useParams } from 'react-router-dom'
import { Box, TextField, Button, List, ListItem, Alert, Typography, Link } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import Web3SubmitDialog from '../../components/Web3SubmitDialog'
import { ErrorMessage } from '@hookform/error-message'
import { useAccount } from 'wagmi'
import { Key } from 'react'

export default function ProjectTribute() {
  const { chainId, daoId, projectId } = useParams()

  // Web3SubmitDialog state vars
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const location = useLocation()

  const project = location?.state as any
  const { manager, projectID, budget, goals, deadline } = project

  const { address: userAddress } = useAccount()
  const isManager = userAddress === manager

  const deadlineDate = new Date()
  deadlineDate.setTime(deadline * 1000)
  const deadlineString = deadlineDate.toUTCString()
  const isExpired = deadlineDate < new Date()

  const hasBudget = Number(budget) > 0

  const cid = Number(chainId)
  const pmAddress = addresses[cid]['extensions']['projectmanagement']
  const formResult = useForm({ criteriaMode: 'all' })
  const {
    register,
    handleSubmit,
    formState: { isValid, errors }
  } = formResult

  const callArgs = ['uint256', 'address', 'uint256', 'string']

  const contractInfo = {
    addressOrName: pmAddress,
    chainId: cid,
    contractInterface: PM_ABI,
    functionName: 'callExtension'
  }

  const [txInput, setTxInput] = useState(undefined as any)

  const onSubmit = async (formData: any) => {
    if (!isValid) return

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

  const onDialogClose = async () => {
    setIsDialogOpen(false)
  }

  if (!chainId || !daoId || !projectId) {
    return <Navigate replace to="/" />
  }

  return (
    <Box
      sx={{
        maxWidth: 400
      }}
    >
      <Alert severity="info">
        Submit tribute for project #{projectID}
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
      </Alert>
      {!isManager && (
        <Alert severity="error">
          You are not the manager of this project. Your wallet account {userAddress} does not match the manager account{' '}
          {manager}.
        </Alert>
      )}
      {isExpired && <Alert severity="error">This project deadline expired on {deadlineString}.</Alert>}
      {!hasBudget && <Alert severity="error">This project has no budget left.</Alert>}
      <List component="form" onSubmit={handleSubmit(onSubmit)}>
        <ListItem>
          <TextField
            id="contributorAddress"
            label="Contributor"
            helperText="ETH L1/L2 address: 0x..."
            variant="filled"
            fullWidth
            required
            {...register('contributorAddress')}
          />
        </ListItem>
        <ListItem>
          <TextField
            label="Mint Amount"
            helperText="Amount in DAO sweat tokens to mint to contributor"
            variant="filled"
            type="number"
            fullWidth
            required
            {...register('mintAmount', {
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
            id="tributeTitle"
            label="Tribute Title"
            helperText="Describe the tribute to the project"
            variant="filled"
            fullWidth
            required
            {...register('tributeTitle')}
          ></TextField>
        </ListItem>
        <ListItem>
          <TextField
            id="tributeLink"
            type="url"
            label="Tribute Reference Link"
            helperText="URL referencing tribute details."
            variant="filled"
            fullWidth
            {...register('tributeLink')}
          />
        </ListItem>
        <ListItem>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </ListItem>
      </List>
      {isDialogOpen && ( // use check to prevent Web3SubmitDialog rendering before open due to wagmi bug in updating config when contract args update with form data
        <Web3SubmitDialog open={isDialogOpen} onClose={onDialogClose} txInput={txInput} hrefAfterSuccess=".." />
      )}
    </Box>
  )
}
