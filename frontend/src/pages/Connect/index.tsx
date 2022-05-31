import { Button, CircularProgress, Container } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ContentBlock from '../../components/ContentBlock'
import useAuth from '../../context/AuthContext'
import useWeb3 from '../../context/Web3Context'
import { PageLayout } from '../../layout/Page'
import ConnectWidget from './components/ConnectWidget'

export function Connect() {
  const { account } = useWeb3()
  const { user, error, resetError } = useAuth()

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const redir = '?redirect='
    const pos = location.search.indexOf(redir)
    if (!location.search || pos === -1) {
      navigate('/')
      return
    }
    const redirPath = location.search.substring(pos + redir.length)
    navigate(redirPath)
  }, [location.search, navigate, user])

  return (
    <PageLayout withDrawer={false}>
      {/* <Container maxWidth="lg" sx={{ mt: '6em' }}> */}
      <ContentBlock title="Connect with your wallet">
        {error ? (
          <Box>
            <p>{error.mesasge || 'An internal error occured during authentication.'}</p>
            <Button onClick={() => resetError()}>Retry</Button>
          </Box>
        ) : account ? (
          <CircularProgress />
        ) : (
          <ConnectWidget />
        )}
      </ContentBlock>
      {/* </Container> */}
    </PageLayout>
  )
}
