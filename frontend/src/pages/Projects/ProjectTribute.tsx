import { useState } from 'react'
import { ethers } from 'ethers'
import { addresses } from '../../constants/addresses'
import PM_ABI from '../../abi/ProjectManagement.json'
import { useParams } from 'react-router-dom'
import { Box, TextField, Button, List, ListItem } from '@mui/material'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import Web3SubmitDialog from '../../components/Web3SubmitDialog'

export default function ProjectTribute() {
  const { chainId, daoId, projectId } = useParams()

  // Web3SubmitDialog state vars
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const cid = Number(chainId)
  const pmAddress = addresses[cid]['extensions']['projectmanagement']
  const { register, handleSubmit } = useForm()

  const callArgs = ['uint256', 'address', 'uint256', 'string']

  const contractInfo = {
    addressOrName: pmAddress || '',
    chainId: cid,
    contractInterface: PM_ABI,
    functionName: 'callExtension'
  }

  const [txInput, setTxInput] = useState(undefined as any)

  const onSubmit = async (formData: any) => {
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
      console.log('Error while encoding project tribute', e)
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
      {isDialogOpen && ( // use check to prevent Web3SubmitDialog rendering before open due to wagmi bug in updating config when contract args update with form data
        <Web3SubmitDialog open={isDialogOpen} onClose={onDialogClose} txInput={txInput} hrefAfterSuccess=".." />
      )}
    </Box>
  )
}
