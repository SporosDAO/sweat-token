import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Box, Typography } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Typography',
  component: Typography,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Typography>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Typography> = (args) => (
  <Box>
    <Typography variant="h1">h1. (Display 2xl) Heading</Typography>
    <Typography variant="h2">h2. (Display xl) Heading</Typography>
    <Typography variant="h3">h3. (Display lg) Heading</Typography>
    <Typography variant="h4">h4. (display md) Heading</Typography>
    <Typography variant="h5">h5. (Display sm) Heading</Typography>
    <Typography variant="h6">h6. (Display xs) Heading</Typography>
    <Typography variant="body2">
      body2. (text xl) Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit,
      quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti?
      Eum quasi quidem quibusdam.
    </Typography>
    <Typography variant="subtitle1">
      subtitle1. (text lg) Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
    </Typography>
    <Typography variant="body1">
      body1. (text md) Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde suscipit,
      quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti?
      Eum quasi quidem quibusdam.
    </Typography>
    <Typography variant="subtitle2">
      subtitle2. (text sm) Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
    </Typography>
    <Typography variant="caption">
      caption. (text xs) caption text Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
      unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum
      fugiat deleniti? Eum quasi quidem quibusdam.
    </Typography>
  </Box>
)

export const Default = Template.bind({})

// More on args: https://storybook.js.org/docs/react/writing-stories/args
