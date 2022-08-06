import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useContractRead, useContractWrite } from 'wagmi'
import { addresses } from '../../constants/addresses'
import KALIDAO_ABI from '../../abi/KaliDAO.json'
import { useParams } from 'react-router-dom'
import { Box, TextField, Button, List, ListItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import Web3Dialog from '../../components/Web3Dialog'

export default function ProjectProposal() {
  const { chainId, daoId } = useParams()

  const cid = Number(chainId)
  const pmAddress = addresses[cid]['extensions']['projectmanagement']
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const daoContract = {
    addressOrName: daoId || '',
    chainId: cid,
    contractInterface: KALIDAO_ABI
  }

  const {
    data,
    isLoading: isWritePending,
    isSuccess: isWriteSuccess,
    isError: isWriteError,
    error: writeError,
    writeAsync
  } = useContractWrite({
    ...daoContract,
    functionName: 'propose',
    onSuccess(data, variables, context) {
      console.debug('success', { data, variables, context })
      // alert(`Proposal successfully submitted on chain.`)
    },
    onError(error, variables, context) {
      console.debug('error', { error, variables, context })
      // alert(`Proposal failed with error: ${error}`)
    }
  })

  const contractReadResult = useContractRead({
    ...daoContract,
    functionName: 'extensions',
    args: [pmAddress]
  })

  const onSubmit = async (data: any) => {
    setDialogOpen(true)
    const { manager, budget, deadline, goalTitle, goalLink } = data
    let payload
    const goals = [{ goalTitle, goalLink }]
    const goalString = JSON.stringify(goals)
    const miliseconds = new Date(deadline).getTime()
    const dateInSecs = Math.floor(miliseconds / 1000)
    try {
      const abiCoder = ethers.utils.defaultAbiCoder
      payload = abiCoder.encode(
        ['uint256', 'address', 'uint256', 'uint256', 'string'],
        [0, manager, ethers.utils.parseEther(budget), dateInSecs, goalString]
      )
    } catch (e) {
      console.log('Error while encoding project proposal', e)
      return
    }

    // https://github.com/kalidao/kali-contracts/blob/c3b25ca762f083dfe88096a7a512b33607c0ac57/contracts/KaliDAO.sol#L111
    const PROPOSAL_TYPE_EXTENSION = 9

    let pmExtensionEnabled
    if (contractReadResult.isSuccess) {
      pmExtensionEnabled = contractReadResult.data
    } else {
      pmExtensionEnabled = await contractReadResult.refetch()
    }
    console.debug({ pmExtensionEnabled })

    // if PM extension is not enabled yet, toggle it on
    const TOGGLE_EXTENSION_AVAILABILITY = pmExtensionEnabled ? 0 : 1

    let description = 'New Project Proposal'
    goals.map(
      (goal) => (description = [description, `Goal: ${goal.goalTitle}`, `Goal Tracking Link: ${goalLink}`].join('.\n'))
    )
    description = [
      description,
      `Manager: ${manager}`,
      `Budget: ${budget}`,
      `Deadline: ${new Date(deadline).toUTCString()}`
    ].join('.\n')
    const tx = await writeAsync({
      args: [PROPOSAL_TYPE_EXTENSION, description, [pmAddress], [TOGGLE_EXTENSION_AVAILABILITY], [payload]],
      overrides: {
        gasLimit: 1050000
      }
    }).catch((e) => {
      console.log('error', e.code, e.reason)
    })
  }

  const onDialogClose = async () => {
    if (isWritePending) {
      return
    }

    setDialogOpen(false)
  }

  const [dialogOpen, setDialogOpen] = React.useState(false)

  if (!chainId || !daoId) {
    console.debug('chainId and daoId required', { chainId, daoId })
    return <Navigate replace to="/" />
  }

  return (
    <Box
      sx={{
        maxWidth: 400
      }}
    >
      <List component="form" onSubmit={handleSubmit(onSubmit)}>
        <ListItem>
          <TextField
            id="manager"
            label="Manager"
            helperText="ETH L1/L2 address: 0x..."
            variant="filled"
            fullWidth
            required
            {...register('manager')}
          />
        </ListItem>
        <ListItem>
          <TextField
            id="budget"
            label="Budget"
            helperText="Amount in DAO sweat tokens"
            variant="filled"
            type="number"
            fullWidth
            required
            {...register('budget')}
          />
        </ListItem>
        <ListItem>
          <TextField
            id="deadline"
            label="Deadline"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            required
            {...register('deadline')}
          />
        </ListItem>
        <ListItem>
          <TextField
            id="goalTitle"
            label="Goal"
            helperText="Describe a measurable goal of the project"
            variant="filled"
            fullWidth
            required
            {...register('goalTitle')}
          />
        </ListItem>
        <ListItem>
          <TextField
            id="goalLink"
            type="url"
            label="Goal Tracking Link"
            helperText="URL to project board where this goal is tracked."
            variant="filled"
            fullWidth
            {...register('goalLink')}
          />
        </ListItem>
        <ListItem>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </ListItem>
      </List>
      <Web3Dialog
        web3tx={{
          dialogOpen,
          onDialogClose,
          isWritePending,
          isWriteError,
          writeError,
          isWriteSuccess,
          hrefAfterSuccess: '../projects'
        }}
      />
    </Box>
  )
}
