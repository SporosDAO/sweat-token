import { Box } from '@mui/system'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Button, CircularProgress, IconButton } from '@mui/material'
import { Check, Error } from '@mui/icons-material'
import { chain } from 'wagmi'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useParams } from 'react-router-dom'
import { useChainGuard } from '@kalidao/hooks'

interface Web3SubmitDialogProps {
  open: boolean
  onClose: any
  txInput: any
  hrefAfterSuccess: string
}

export default function Web3SubmitDialog(props: Web3SubmitDialogProps) {
  const { open, onClose, txInput, hrefAfterSuccess } = props

  const { chainId: daoChainId } = useParams()

  const { isUserOnCorrectChain, isUserConnected, userChain } = useChainGuard({ chainId: Number(daoChainId) })

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

  let daoChainName
  let wrongChainWarning
  if (isUserOnCorrectChain && isIdle && !isWritePending && !isWriteError && !isWriteSuccess && write) {
    try {
      write()
    } catch (writeError) {
      console.error({ writeError })
    }
  } else {
    daoChainName = Object.values(chain).find((chain) => chain.id === Number(daoChainId))?.name
    wrongChainWarning = !isUserConnected
      ? `Your Web3 wallet is disconnected.`
      : `Your Web3 wallet is connected to ${userChain?.name}.`
  }

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-testid="web3dialog"
    >
      <DialogTitle data-testid="web3submit-alert-dialog-title">
        Submitting On-chain Transaction!
        {isWriteError && (
          <IconButton
            aria-label="error"
            color="error"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <Error />
          </IconButton>
        )}
        {isWriteSuccess && (
          <IconButton
            sx={{
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
        )}
        {isWritePending && (
          <IconButton
            aria-label="button-progress"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CircularProgress />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        {isPrepWriteError && (
          <Box data-testid="alert-dialog-message-prepare-error" sx={{ display: isPrepWriteError ? 'block' : 'none' }}>
            <DialogContentText color="error">Error preparing transaction!</DialogContentText>
            <DialogContentText color="error">{prepWriteError?.message}</DialogContentText>
            <DialogContentText>
              Possibly reverting due to invalid arguments. Please report to support team.
            </DialogContentText>
          </Box>
        )}
        {isWriteError && (
          <Box data-testid="alert-dialog-message-write-error">
            <DialogContentText color="error">ERROR!</DialogContentText>
            <DialogContentText color="error">{writeError?.message}</DialogContentText>
            <DialogContentText>Please check your web3 wallet for details.</DialogContentText>
          </Box>
        )}
        {!isUserOnCorrectChain && (
          <Box data-testid="alert-dialog-chainguard-error">
            <DialogContentText sx={{ color: 'warning.dark' }}>Warning!</DialogContentText>
            <DialogContentText sx={{ color: 'warning.dark' }}>{wrongChainWarning}</DialogContentText>
            <DialogContentText>
              You need to connect to {daoChainName} - the native blockchain of this DAO - in order to submit
              transactions to it.
            </DialogContentText>
          </Box>
        )}
        {isWritePending && (
          <Box id="alert-dialog-message-pending">
            <DialogContentText>Please review and approve the transaction in your web3 wallet.</DialogContentText>
          </Box>
        )}
        {isWriteSuccess && (
          <Box id="alert-dialog-message-success">
            <DialogContentText>Transaction successfully submitted!</DialogContentText>
            <DialogContentText>
              Note that it may take several minutes for the transaction to confirm on chain. Check your web3 wallet for
              final tx status. Once tx is confirmed it may take several minutes for the tx data to propagate to the UI.
            </DialogContentText>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {(!isUserOnCorrectChain || isWriteError || isPrepWriteError) && (
          <Button
            data-testid="close-button"
            onClick={(event: object) => onClose(event, 'close-clicked', false)}
            autoFocus
          >
            Close
          </Button>
        )}
        {isWriteSuccess && (
          <Button data-testid="done-button" href={`${hrefAfterSuccess}`} autoFocus>
            Done
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
