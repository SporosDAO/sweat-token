import { Box, List, ListItem, Paper } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <Box sx={{ p: 5 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <h1>Welcome to Sweat Token</h1>

        <p>This is a placeholder for a landing page</p>

        <List>
          <ListItem>
            <Link to="/sporos/dashboard">Sporos (Test)</Link>
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}
