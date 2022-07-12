import { Card, CardContent, Typography, ListItem } from '@mui/material'
import { useEnsName, useEnsAvatar } from 'wagmi'
import { ethers } from 'ethers'

export default function PersonCard(props: any) {
  const person = props.person
  const tokenTotalSupply = props.tokenTotalSupply

  const paddr = person['address']
  const ensNameResult = useEnsName({ address: paddr, chainId: Number(1), cacheTime: 60_000 })
  console.debug('useEnsName', { ensNameResult })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const ensAvatarResult = useEnsAvatar({ addressOrName: paddr, chainId: Number(1), cacheTime: 60_000 })
  console.debug('useEnsAvatar', { ensAvatarResult })
  const ensAvatar = !ensAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''

  return (
    <ListItem key={person['address']}>
      <Card sx={{ minWidth: 400 }} raised={true}>
        <CardContent>
          <Typography variant="h5" component="div">
            {ensName}
          </Typography>
          <div>{ensAvatar}</div>
          <Typography>{person['address']}</Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            tokens: {ethers.utils.formatEther(person['shares'], { commify: true })}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            stake: {((100 * person['shares']) / tokenTotalSupply).toFixed(2)}%
          </Typography>
        </CardContent>
      </Card>
    </ListItem>
  )
}
