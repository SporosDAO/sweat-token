import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Box, TextField } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/TextField',
  component: TextField,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof TextField>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof TextField> = (args) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="space-between"
    maxWidth="600px"
    flexWrap="wrap"
  >
    <TextField label="hi" placeholder="test" helperText="helper" {...args} />
    <TextField label="hi" placeholder="test" helperText="helper" {...args} error />
  </Box>
)

export const Default = Template.bind({})

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  disabled: false
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
