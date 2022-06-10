import { CircularProgress, Grid, Paper } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDao from '../../context/DaoContext'
import useToast from '../../context/ToastContext'

export default function Dashboard() {
  const { loading, dao } = useDao()
  // console.log('dao data is:', dao)
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    if (loading) return
    if (dao) return
    showToast('Dao not found', 'error')
    navigate('/')
  }, [dao, loading, navigate, showToast])

  return loading ? (
    <CircularProgress />
  ) : (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240
          }}
        >
          <h2>Welcome to {dao?.name}</h2>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 240
          }}
        >
          <h2>Projects overview</h2>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <h2>Ongoing Proposals</h2>
        </Paper>
      </Grid>
    </Grid>
  )
}
