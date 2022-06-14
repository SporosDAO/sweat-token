import { Grid, Paper, useTheme, useMediaQuery } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  legal_content: {
    margin: '0 40px'
    // textAlign: 'center'
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
            p: 2
            // height: 240
          }}
        >
          <h2>Taxes and Accounting</h2>
          <div className={classes.legal_content}>
            <div className={classes.legal_button}>Tax ID / EIN: 22-333-6666</div>
            <div className={classes.legal_button}>Last Year Tax Report</div>
            <div className={classes.legal_button}>Tax Vault: $15,000</div>
            <div className={classes.legal_button}>Tax Withholding Contract</div>
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}
