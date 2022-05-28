import { DialogContent, DialogTitle } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { useEffect } from 'react'
import { Connect } from '..'
import useWeb3 from '../../../context/Web3Context'

export interface ConnectDialogProps {
  open: boolean
  onClose: () => void
}

export default function ConnectDialog(props: ConnectDialogProps) {
  const { onClose, open } = props
  const { account } = useWeb3()
  useEffect(() => {
    if (!account) return
    onClose()
  }, [account, onClose])

  return (
    <Dialog keepMounted onClose={onClose} open={!account && open}>
      <DialogTitle>Connect with your wallet</DialogTitle>
      <DialogContent>
        <Connect />
      </DialogContent>
    </Dialog>
  )
}
