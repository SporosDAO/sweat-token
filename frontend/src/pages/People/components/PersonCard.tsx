import { Card, CardContent, Typography, ListItem } from '@mui/material'
import { useEnsName, useEnsAvatar } from 'wagmi'
import { ethers } from 'ethers'

export default function PersonCard(props: any) {
  const { person, tokenTotalSupply } = props
  const { address, shares } = person

  const ensNameResult = useEnsName({ address: address, chainId: Number(1), cacheTime: 60_000 })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const ensAvatarResult = useEnsAvatar({ addressOrName: address, chainId: Number(1), cacheTime: 60_000 })
  const ensAvatar = !ensAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''

  return (
    <ListItem key={person['address']}>
      <Card sx={{ minWidth: 400 }} raised>
        <CardContent>
          <Typography variant="h5" component="div">
            {ensName}
          </Typography>
          <div>{ensAvatar}</div>
          <Typography>{person['address']}</Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Tokens: {ethers.utils.formatEther(shares)}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Stake: {((100 * shares) / tokenTotalSupply).toFixed(2)}%
          </Typography>
        </CardContent>
      </Card>
    </ListItem>
  )
}
