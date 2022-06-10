import { Grid, Paper, useMediaQuery, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {},
  legal_content: {
    margin: '0 40px'
  },
  legal_button: {
    marginBottom: '10px',
    fontSize: '16px',
    lineHeight: '20px',
    cursor: 'pointer'
  }
}))

export default function Legal() {
  const theme = useTheme()
  const classes = useStyles()
  const navigate = useNavigate()
  // console.log("theme is:", theme)
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper
          sx={{
            p: 2,
            height: '100%'
          }}
        >
          <h2>Dao Legal Assets</h2>
          <div className={classes.legal_content}>
            <div className={classes.legal_button} onClick={() => navigate('registration')}>
              DELAWARE LLC REGISTRATION
            </div>
            <div className={classes.legal_button} onClick={() => navigate('registration')}>
              DELAWARE LLC OPERATING AGREEMENT
            </div>
            <div className={classes.legal_button} onClick={() => navigate('registration')}>
              Sweat Equity Contributor Agreement
            </div>
            <div className={classes.legal_button} onClick={() => navigate('registration')}>
              Doxxed Members
            </div>
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}
