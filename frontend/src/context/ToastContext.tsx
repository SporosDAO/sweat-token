import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import * as React from 'react'

interface ToastMessage {
  message: string
  type: AlertColor
}

interface ToastContextType {
  showToast: (msg: string, type?: AlertColor) => void
}

const ToastContext = React.createContext<ToastContextType>({} as ToastContextType)

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export function ToastProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [toastMessage, setToastMessage] = React.useState<ToastMessage>()
  const [open, setOpen] = React.useState<boolean>(false)

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const value = {
    showToast: (message: string, type?: AlertColor) => {
      setToastMessage({
        message,
        type: type || 'info'
      })
      setOpen(true)
    }
  } as ToastContextType

  return (
    <ToastContext.Provider value={value}>
      {toastMessage ? (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <Alert onClose={handleClose} severity={toastMessage.type} sx={{ width: '100%' }}>
            {toastMessage.message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      {children}
    </ToastContext.Provider>
  )
}

export default function useToast() {
  return React.useContext(ToastContext)
}
