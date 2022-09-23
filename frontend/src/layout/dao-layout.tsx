import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

export const DaoLayout: React.FC<{ children: Array<React.ReactNode> }> = (props) => (
  <Grid container spacing={0} sx={{ height: '100vh' }}>
    <Grid item xs={12} md={7}>
      <Box
        sx={{
          p: '15px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #EEF2F6'
        }}
      >
        <img src="/icons/x.svg" alt="X Icon" />
        <Box sx={{ m: '0 10px', background: '#EEF2F6', width: '1px', height: '20px' }} />
        <Typography variant="subtitle1" sx={{ color: '#202939' }}>
          Start your DAO with Sporos
        </Typography>
      </Box>
      <Box sx={{ p: '40px 48px' }}>{props.children[0]}</Box>
    </Grid>
    <Grid item xs={12} md={5} sx={{ p: '120px 32px', background: '#FAFCFF', borderLeft: '1px solid #EEF2F6' }}>
      {props.children[1]}
    </Grid>
  </Grid>
)
