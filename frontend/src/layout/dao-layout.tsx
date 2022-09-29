import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

export const DaoLayout: React.FC<{ children: Array<React.ReactNode>; hideSidebar?: boolean }> = (props) => {
  const navigate = useNavigate()
  return (
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
          <img src="/icons/x.svg" alt="X Icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/')} />
          <Box sx={{ m: '0 10px', background: '#EEF2F6', width: '1px', height: '20px' }} />
          <Typography variant="subtitle2" sx={{ color: '#202939', fontWeight: 500 }}>
            Start your Company with Sporos
          </Typography>
        </Box>
        <Box sx={{ p: '40px 48px' }}>{props.children[0]}</Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          p: '120px 32px',
          borderLeft: props.hideSidebar ? 'none' : '1px solid #EEF2F6',
          background: props.hideSidebar ? '#fff' : '#FAFCFF url(/sporos.png) bottom right no-repeat'
        }}
      >
        {props.children[1]}
      </Grid>
    </Grid>
  )
}
