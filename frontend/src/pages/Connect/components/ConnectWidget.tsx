import { Avatar, CircularProgress, DialogContent, ListItemAvatar } from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Box } from '@mui/system'
import { useEffect } from 'react'
import useWeb3, { providers } from '../../../context/Web3Context'
import { useMetaMask } from '../../../context/Web3Context/useMetamask'

interface WalletProvidersListProps {
  onClick: (provider: string) => void
}

const WalletProvidersList = ({ onClick }: WalletProvidersListProps) => {
  return (
    <Box>
      <DialogTitle>Connect with</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          {providers.map((provider) => (
            <ListItem button onClick={() => onClick(provider.id)} key={provider.id}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: '#EFEFEF' }}>
                  <img src={provider.icon} alt={provider.name} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={provider.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Box>
  )
}

interface MetamaskWalletProps {
  onComplete: (account: string) => void
}

const MetamaskWallet = ({ onComplete }: MetamaskWalletProps) => {
  const { pending, loading, isInstalled, connectedAccount, connectWallet } = useMetaMask()

  useEffect(() => {
    if (connectedAccount === undefined) return
    console.debug(`Got metamask address ${connectedAccount}`)
    onComplete(connectedAccount as string)
  }, [connectedAccount, onComplete])

  useEffect(() => {
    if (connectedAccount !== undefined) return
    connectWallet()
  })

  return (
    <Box>
      {pending ? (
        <Box>Please open Metamask and confirm the operation to continue</Box>
      ) : loading ? (
        <CircularProgress />
      ) : !isInstalled() ? (
        <Box>Metamask is not installed. </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </Box>
      )}
    </Box>
  )
}

interface RenderWalletProps {
  walletProvider: string
  setAccount: (account: string) => void
}

const RenderWallet = (props: RenderWalletProps) => {
  switch (props.walletProvider) {
    case 'metamask':
    default:
      return <MetamaskWallet onComplete={props.setAccount} />
  }
}

export default function ConnectWidget(props: any) {
  const { walletProvider, setWalletProvider, setAccount } = useWeb3()

  return walletProvider === undefined ? (
    <WalletProvidersList onClick={setWalletProvider} />
  ) : (
    <RenderWallet walletProvider={walletProvider} setAccount={setAccount} />
  )
}
