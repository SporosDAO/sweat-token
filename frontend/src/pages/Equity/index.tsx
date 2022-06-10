import { Grid, Paper, useMediaQuery, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  legal_content: {
    margin: '0 40px'
  },
  legal_button: {
    marginBottom: '10px',
    fontSize: '16px',
    lineHeight: '20px'
  }
}))

export default function Equity() {
  const theme = useTheme()
  const classes = useStyles()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper
          sx={{
            p: 2,
            height: 240
          }}
        >
          <h2>Issued Sweat Equity Warrants </h2>
          <div className={classes.legal_content}>
            <div className={classes.legal_button}>lipman.eth: 16%</div>
            <div className={classes.legal_button}>kleb: 15.4%</div>
            <div className={classes.legal_button}>ivelin.eth: 14%</div>
            <div className={classes.legal_button}>bigbabol: 8%</div>
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}
