import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'

export const ActionDocLayout: React.FC<{ children: Array<React.ReactNode> }> = (props) => {
  const navigate = useNavigate()
  return (
    <Grid container spacing={0} sx={{ minHeight: '100vh' }}>
      <Grid item xs={12} md={7}>
        <Box
          sx={{
            p: '15px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <IconButton aria-label="Close" onClick={() => navigate('/')}>
            <Close />
          </IconButton>
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
          borderLeft: '1px solid #EEF2F6',
          background: '#FAFCFF url(/sporos.png) bottom right no-repeat'
        }}
      >
        {props.children[1]}
      </Grid>
    </Grid>
  )
}
