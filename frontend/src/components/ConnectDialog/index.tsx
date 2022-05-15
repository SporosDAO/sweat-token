import { DialogContent } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Box } from '@mui/system'
import { useEffect, useMemo, useState } from 'react'
import useWeb3, { WalletProvider } from '../../context/Web3Context'

import { useMetaMask } from '../../context/Web3Context/useMetamask'

export interface ConnectDialogProps {
  open: boolean
  onClose: () => void
}

interface RenderConnectProps {
  provider: WalletProvider
}

const ConnectWallet = ({ provider }: RenderConnectProps) => {
  useMemo(() => provider.connect(), [])
  return (
    <Box>
      <DialogTitle>Connect with {provider.name}</DialogTitle>
      <DialogContent>
        {!provider.isInstalled() ? <Box>{provider.name} is not installed. </Box> : <Box>Please select a wallet.</Box>}
      </DialogContent>
    </Box>
  )
}

interface WalletProvidersListProps {
  providers: WalletProvider[]
  onClick: (providers: WalletProvider) => void
}
const WalletProvidersList = ({ providers, onClick }: WalletProvidersListProps) => {
  return (
    <Box>
      <DialogTitle>Connect with</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          {providers.map((provider) => (
            <ListItem button onClick={() => onClick(provider)} key={provider.name}>
              {/* <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar> */}
              <ListItemText primary={provider.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Box>
  )
}

export default function ConnectDialog(props: ConnectDialogProps) {
  const { onClose, open } = props
  const { providers, selectedProvider, setProvider } = useWeb3()
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (completed) return
    if (!selectedProvider) return
    selectedProvider.getAccount().then((account: string | undefined) => {
      if (!account) return
      setCompleted(true)
    })
  }, [selectedProvider, completed])

  useEffect(() => {
    if (!completed) return
    onClose()
  }, [completed])

  return (
    <Dialog keepMounted onClose={onClose} open={!completed && open}>
      {selectedProvider === undefined ? (
        <WalletProvidersList providers={providers} onClick={setProvider} />
      ) : (
        <ConnectWallet provider={selectedProvider} />
      )}
    </Dialog>
  )
}
