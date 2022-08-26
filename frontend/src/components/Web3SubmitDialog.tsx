import { Box } from '@mui/system'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Button, CircularProgress, IconButton } from '@mui/material'
import { Check, Error } from '@mui/icons-material'
import { useNetwork } from 'wagmi'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useParams } from 'react-router-dom'

interface Web3SubmitDialogProps {
  open: boolean
  onClose: any
  txInput: any
  hrefAfterSuccess: string
}

export default function Web3SubmitDialog(props: Web3SubmitDialogProps) {
  const { open, onClose, txInput, hrefAfterSuccess } = props

  const { chainId: daoChainId } = useParams()

  const { chain: userChain, chains } = useNetwork()

  const isUserOnCorrectChain = userChain?.id && Number(daoChainId) === userChain?.id ? true : false

  // console.debug({ isUserOnCorrectChain })

  const usePrepareContractWriteResult = usePrepareContractWrite({
    ...txInput,
    onError(usePrepareContractWriteError) {
      console.error({ usePrepareContractWriteError })
    }
  })

  const {
    config: prepCallExtensionConfig,
    isError: isPrepWriteError,
    error: prepWriteError
  } = usePrepareContractWriteResult

  // console.debug({ prepCallExtensionConfig, isPrepWriteError, prepWriteError })

  const useContractWriteResult = useContractWrite({
    ...prepCallExtensionConfig,
    onError(useContractWriteError) {
      console.error({ useContractWriteError })
    }
  })

  const {
    // data: writeResult,
    isLoading: isWritePending,
    isSuccess: isWriteSuccess,
    isError: isWriteError,
    error: writeError,
    isIdle,
    write
  } = useContractWriteResult

  // console.debug({ isWritePending, isWriteSuccess, isWriteError, writeError })

  let daoChainName
  let wrongChainWarning
  if (isUserOnCorrectChain && isIdle && !isWritePending && !isWriteError && !isWriteSuccess && write) {
    try {
      write()
    } catch (writeError) {
      console.error({ writeError })
    }
  } else {
    daoChainName = chains?.find((chain) => chain.id === Number(daoChainId))?.name
    wrongChainWarning =
      !isUserOnCorrectChain && userChain
        ? `Your Web3 wallet is connected to ${userChain?.name}.`
        : `Your Web3 wallet is disconnected.`
  }

  // console.debug({ daoChainName, wrongChainWarning })

  return (
    <Dialog
      open={open}
      onClose={(event: object, reason: string) => onClose(event, reason, isWriteSuccess)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Submitting On-chain Transaction!
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
          aria-label="button-progress"
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
        <Box id="alert-dialog-message-error" sx={{ display: isPrepWriteError ? 'block' : 'none' }}>
          <DialogContentText color="error">Error preparing transaction!</DialogContentText>
          <DialogContentText color="error">{prepWriteError?.message}</DialogContentText>
          <DialogContentText>
            Possibly reverting due to invalid arguments. Please report to support team.
          </DialogContentText>
        </Box>
        <Box id="alert-dialog-message-error" sx={{ display: isWriteError ? 'block' : 'none' }}>
          <DialogContentText color="error">ERROR!</DialogContentText>
          <DialogContentText color="error">{writeError?.message}</DialogContentText>
          <DialogContentText>Please check your web3 wallet for details.</DialogContentText>
        </Box>
        <Box id="alert-dialog-message-error" sx={{ display: isUserOnCorrectChain ? 'none' : 'block' }}>
          <DialogContentText sx={{ color: 'warning.dark' }}>Warning!</DialogContentText>
          <DialogContentText sx={{ color: 'warning.dark' }}>{wrongChainWarning}</DialogContentText>
          <DialogContentText>
            You need to connect to {daoChainName} - the native blockchain of this DAO - in order to submit transactions
            to it.
          </DialogContentText>
        </Box>
        <Box id="alert-dialog-message-pending" sx={{ display: isWritePending ? 'block' : 'none' }}>
          <DialogContentText>Please review and approve the transaction in your web3 wallet.</DialogContentText>
        </Box>
        <Box id="alert-dialog-message-success" sx={{ display: isWriteSuccess ? 'block' : 'none' }}>
          <DialogContentText>Transaction successfully submitted!</DialogContentText>
          <DialogContentText>
            Note that it may take several minutes for the transaction to confirm on chain. Check your web3 wallet for
            final tx status. Once tx is confirmed it may take several minutes for the tx data to propagate to the UI.
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ display: !isUserOnCorrectChain || isWriteError || isPrepWriteError ? 'block' : 'none' }}
          onClick={(event: object) => onClose(event, 'close-clicked', false)}
          autoFocus
        >
          Close
        </Button>
        <Button sx={{ display: isWriteSuccess ? 'block' : 'none' }} href={`${hrefAfterSuccess}`} autoFocus>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
}
