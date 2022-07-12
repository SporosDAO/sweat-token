import { Box } from '@mui/system'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Button, CircularProgress, IconButton } from '@mui/material'
import { Check, Error } from '@mui/icons-material'

interface Web3DialogProps {
  web3tx: {
    dialogOpen: boolean
    onDialogClose: any
    isWritePending: boolean
    isWriteError: boolean
    writeError: any
    isWriteSuccess: boolean
    hrefAfterSuccess: string
  }
}

export default function Web3Dialog(props: Web3DialogProps) {
  console.debug('Web3Dialog', {
    props
  })
  const { dialogOpen, onDialogClose, isWritePending, isWriteError, writeError, isWriteSuccess, hrefAfterSuccess } =
    props.web3tx
  return (
    <Dialog
      open={dialogOpen}
      onClose={onDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Submitting On-chain
        <IconButton
          aria-label="error"
          color="error"
          sx={{
            display: isWriteError ? 'block' : 'none',
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <Error />
        </IconButton>
        <IconButton
          sx={{
            display: isWriteSuccess ? 'block' : 'none',
            position: 'absolute',
            right: 8,
            top: 8
          }}
          id="alert-dialog-success"
          color="primary"
          aria-label="success"
        >
          <Check />
        </IconButton>
        <IconButton
          aria-label="close"
          sx={{
            display: isWritePending ? 'block' : 'none',
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CircularProgress />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box id="alert-dialog-message-pending" sx={{ display: isWritePending ? 'block' : 'none' }}>
          <DialogContentText>Please review and approve the transaction in your web3 wallet.</DialogContentText>
        </Box>
        <Box id="alert-dialog-message-error" sx={{ display: isWriteError ? 'block' : 'none' }}>
          <DialogContentText color="error">ERROR:</DialogContentText>
          <DialogContentText color="error">{writeError?.message}</DialogContentText>
          <DialogContentText>Please check your web3 wallet for details.</DialogContentText>
        </Box>
        <Box id="alert-dialog-message-success" sx={{ display: isWriteSuccess ? 'block' : 'none' }}>
          <DialogContentText>Proposal successfully submitted!</DialogContentText>
          <DialogContentText>
            Note that it may take several minutes for the transaction to confirm on chain. Check your web3 wallet for
            final tx status. Once tx is confirmed it may take several minutes for the tx data to propagate to the UI.
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button sx={{ display: isWriteError ? 'block' : 'none' }} onClick={onDialogClose}>
          Close
        </Button>
        <Button sx={{ display: isWriteSuccess ? 'block' : 'none' }} href={`${hrefAfterSuccess}`}>
          Return to Projects
        </Button>
      </DialogActions>
    </Dialog>
  )
}
