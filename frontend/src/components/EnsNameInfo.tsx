import { useEnsName } from 'wagmi'
import { Alert } from '@mui/material'
import { AddressZero } from '@ethersproject/constants'
import { ethers } from 'ethers'

export default function EnsNameInfo(props: { address: string }): JSX.Element {
  const { address, ...otherProps } = props

  const isValidAddress = ethers.utils.isAddress(address)

  const { data: ensName, isSuccess: isEnsName } = useEnsName({
    address: isValidAddress ? address : AddressZero,
    chainId: 1
  })

  // console.debug('Founder address provided to ENS lookup:', { address })

  return isValidAddress && isEnsName && ensName ? (
    <Alert severity="info" {...otherProps}>
      ENS name: {ensName}
    </Alert>
  ) : (
    <></>
  )
}
