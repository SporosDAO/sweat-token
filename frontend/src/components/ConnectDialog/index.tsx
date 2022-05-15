import { Avatar, CircularProgress, DialogContent, ListItemAvatar } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Box } from '@mui/system'
import { useCallback, useEffect } from 'react'
import useWeb3, { providers } from '../../context/Web3Context'
import { useMetaMask } from '../../context/Web3Context/useMetamask'

export interface ConnectDialogProps {
  open: boolean
  onClose: () => void
}

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
                  <img src={provider.icon} />
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
  const { isInstalled, connectedAccount, connectWallet } = useMetaMask()

  useEffect(() => {
    if (connectedAccount === undefined) return
    console.log(`Got metamask address ${connectedAccount}`)
    onComplete(connectedAccount as string)
  }, [connectedAccount])

  useEffect(() => {
    if (connectedAccount !== undefined) return
    connectWallet()
  })

  return (
    <Box>
      <DialogTitle>Connect with Metamask</DialogTitle>
      <DialogContent>
        {!isInstalled() ? (
          <Box>Metamask is not installed. </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          </Box>
        )}
      </DialogContent>
    </Box>
  )
}

export default function ConnectDialog(props: ConnectDialogProps) {
  const { onClose, open } = props
  const { walletProvider, setWalletProvider, account, setAccount } = useWeb3()

  useEffect(() => {
    if (!account) return
    onClose()
  }, [account])

  const renderWallet = useCallback(() => {
    switch (walletProvider) {
      case 'metamask':
        return <MetamaskWallet onComplete={setAccount} />
    }
  }, [walletProvider])

  return (
    <Dialog keepMounted onClose={onClose} open={!account && open}>
      {walletProvider === undefined ? <WalletProvidersList onClick={setWalletProvider} /> : open ? renderWallet() : ''}
    </Dialog>
  )
}
