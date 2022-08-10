import React from 'react'
import { ethers } from 'ethers'
import { useContractWrite } from 'wagmi'
import { addresses } from '../../constants/addresses'
import PM_ABI from '../../abi/ProjectManagement.json'
import { useParams } from 'react-router-dom'
import { Box, TextField, Button, List, ListItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import Web3Dialog from '../../components/Web3Dialog'

export default function ProjectTribute() {
  const { chainId, daoId, projectId } = useParams()

  const cid = Number(chainId)
  const pmAddress = addresses[cid]['extensions']['projectmanagement']
  const { register, handleSubmit } = useForm()

  const {
    isLoading: isWritePending,
    isSuccess: isWriteSuccess,
    isError: isWriteError,
    error: writeError,
    writeAsync
  } = useContractWrite({
    addressOrName: pmAddress || '',
    chainId: cid,
    contractInterface: PM_ABI,
    functionName: 'callExtension',
    onSuccess(data, variables, context) {
      // alert(`Proposal successfully submitted on chain.`)
    },
    onError(error, variables, context) {
      console.debug('error', { error, variables, context })
      // alert(`Proposal failed with error: ${error}`)
    }
  })

  const onSubmit = async (data: any) => {
    setDialogOpen(true)
    const { contributorAddress, mintAmount, tributeTitle, tributeLink } = data
    const tribute = [{ tributeTitle, tributeLink }]
    const tributeString = JSON.stringify(tribute)

    let payload
    try {
      const abiCoder = ethers.utils.defaultAbiCoder
      payload = abiCoder.encode(
        ['uint256', 'address', 'uint256', 'string'],
        [
          projectId, // project id of the just activated project
          contributorAddress, // address of contributor to receive DAO tokens
          ethers.utils.parseEther(mintAmount), // mint amount in whole token units similar to Ether with 18 decimal places
          tributeString // reference to tribute that contributor makes to DAO in exchange for DAO tokens
        ]
      )
    } catch (e) {
      console.log('Error while encoding project tribute', e)
      return
    }

    await writeAsync({
      args: [daoId, [payload]],
      overrides: {
        gasLimit: 1050000
      }
    }).catch((e) => {
      console.log('writeAsync error', { e })
    })
  }

  const onDialogClose = async () => {
    if (isWritePending) {
      return
    }

    setDialogOpen(false)
  }

  const [dialogOpen, setDialogOpen] = React.useState(false)

  if (!chainId || !daoId || !projectId) {
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
            id="mintAmount"
            label="Mint Amount"
            helperText="Amount in DAO sweat tokens to mint to contributor"
            variant="filled"
            type="number"
            fullWidth
            required
            {...register('mintAmount')}
          />
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
          />
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
      <Web3Dialog
        web3tx={{
          dialogOpen,
          onDialogClose,
          isWritePending,
          isWriteError,
          writeError,
          isWriteSuccess,
          hrefAfterSuccess: '..'
        }}
      />
    </Box>
  )
}
