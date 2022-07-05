import { useEffect, useState } from 'react'
import { Snackbar, Button } from '@mui/material'
import * as serviceWorkerRegistration from '../serviceWorkerRegistration'

export function ServiceWorkerWrapper(props: any) {
  const [showReload, setShowReload] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true)
    setWaitingWorker(registration.waiting)
  }

  useEffect(() => {
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://cra.link/PWA
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate })
  }, [])

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' })
    setShowReload(false)
    window.location.reload()
  }

  return (
    <Snackbar
      open={showReload}
      message="A new version is available!"
      onClick={reloadPage}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      action= {
        <Button color="inherit" size="small" onClick={reloadPage}>
          Reload
        </Button>
      }
    />
  )
}

export default ServiceWorkerWrapper
