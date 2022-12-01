import { Card, CardContent, CardActions, CardActionArea } from '@mui/material'
import { Button, Typography } from '@mui/material'
import { useEnsName, useEnsAvatar } from 'wagmi'
import { Launch, ReadMore } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

export default function DaoCard(props: any) {
  const { dao, chain } = props

  // console.log({ dao, chain }, dao.id, dao.address, dao.birth)

  const ensNameResult = useEnsName({ address: dao.address, chainId: Number(1), cacheTime: 60_000 })
  const ensName = !ensNameResult.isError && !ensNameResult.isLoading ? ensNameResult.data : ''
  const ensAvatarResult = useEnsAvatar({ addressOrName: dao.address, chainId: Number(1), cacheTime: 60_000 })
  const ensAvatar = !ensAvatarResult.isError && !ensAvatarResult.isLoading ? ensAvatarResult.data : ''

  const navigate = useNavigate()

  return (
    <Card sx={{ margin: '8px', width: '48.5%' }} data-testid={dao['address']} raised={true}>
      <CardActionArea
        data-testid={`projects-link-${dao.id}`}
        onClick={() => {
          navigate(`dao/chain/${chain.id}/address/${dao['address']}/projects/`)
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            {dao.token.name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            Symbol: {dao.token.symbol}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            Chain: {chain.name}
          </Typography>
          {ensName && (
            <div>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                ENS: {ensName}
              </Typography>
              <div>{ensAvatar}</div>
            </div>
          )}
          <Typography sx={{ fontSize: 14 }} color="text.secondary">
            Address: {dao.address}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="text"
          data-testid={`projects-link-${dao.id}`}
          endIcon={<ReadMore />}
          onClick={() => {
            navigate(`dao/chain/${chain.id}/address/${dao.address}/projects/`)
          }}
        >
          Open
        </Button>
        <Button
          variant="text"
          color="secondary"
          data-testid={`kali-link-${dao.id}`}
          endIcon={<Launch />}
          href={`https://app.kali.gg/daos/${chain.id}/${dao.address}`}
          rel="noopener"
          target="_blank"
        >
          Kali
        </Button>
      </CardActions>{' '}
    </Card>
  )
}
