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
    lineHeight: '20px',
    cursor: 'pointer'
  }
}))

export default function Registration() {
  const theme = useTheme()
  const classes = useStyles()
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
          <h2>Coming Soon...</h2>
        </Paper>
      </Grid>
    </Grid>
  )
}
