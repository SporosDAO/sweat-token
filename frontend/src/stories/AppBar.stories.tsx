import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/AppBar',
  component: AppBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof AppBar>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof AppBar> = (args) => (
  <AppBar position="absolute">
    <Toolbar
      sx={{
        pr: '24px' // keep right padding when drawer closed
      }}
    >
      <Avatar alt="Sporos DAO logo" src="/logo192.png" sx={{ width: '32px', height: '32px' }} />

      <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ ml: 2 }}>
        Sporos DAO
      </Typography>
      <IconButton color="inherit" aria-label="account">
        {/* <Badge badgeContent={4} color="secondary">
      <NotificationsIcon />
    </Badge> */}
      </IconButton>
      <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        <Button variant="text" size="large">
          Nav One
        </Button>
        <Button variant="text" size="large">
          Nav Two
        </Button>
        <Button variant="text" size="large">
          Nav Three
        </Button>
      </Box>
      <Box>
        <Button variant="outlined" size="large">
          Connect
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
)

export const Default = Template.bind({})

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {}
