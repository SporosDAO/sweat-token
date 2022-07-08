import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useContractWrite } from 'wagmi'
import { useForm } from 'react-hook-form'
import { addresses } from '../../constants/addresses'
import KALIDAO_ABI from '../../abi/KaliDAO.json'
import { useParams } from 'react-router-dom'
import { Box, TextField, Button, List, ListItem } from '@mui/material'

export default function ProposeProject({ setProposal }) {
  const { chainId, daoId } = useParams()
  //   addresses[daoChainId]['extensions']['projectmanagement']
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const {
    data,
    isLoading: isWritePending,
    isSuccess: isWriteSuccess,
    isError,
    error,
    writeAsync
  } = useContractWrite(
    {
      addressOrName: daoId,
      contractInterface: KALIDAO_ABI
    },
    'propose',
    {
      onSuccess(data) {
        console.log('success!', data)
      }
    }
  )

  const onSubmit = async (data) => {
    const { id, manager, budget, deadline, goals, description } = data
    let payload
    try {
      const abiCoder = ethers.utils.defaultAbiCoder
      payload = abiCoder.encode(
        ['uint256', 'address', 'uint256', 'uint256', 'string'],
        [0, manager, ethers.utils.parseEther(budget), parseInt(new Date(deadline).getTime() / 1000), goals]
      )
    } catch (e) {
      console.log('error', e)
      return
    }

    const tx = await writeAsync({
      args: [9, description, [addresses[chainId]['extensions']['projectmanagement']], [1], [payload]],
      overrides: {
        gasLimit: 1050000
      }
    }).catch((e) => {
      console.log('error', e.code, e.reason)
    })
  }

  return (
    <Box
      sx={{
        maxWidth: 400
      }}
    >
      <List component="form" onSubmit={handleSubmit(onSubmit)}>
        <ListItem>
          <TextField id="manager" label="Manager" helperText="0x..." variant="filled" fullWidth />
        </ListItem>
        <ListItem>
          <TextField
            id="budget"
            label="Budget"
            helperText="Amount in DAO sweat tokens"
            variant="filled"
            type="number"
            fullWidth
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
          />
        </ListItem>
        <ListItem>
          <TextField id="goal" label="Goal" helperText="Measurable goal of the project" variant="filled" fullWidth />
        </ListItem>
        <ListItem>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </ListItem>
      </List>
    </Box>
  )
}
