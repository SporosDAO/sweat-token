import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Box, Chip } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Chip',
  component: Chip,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Chip>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Chip> = (args) => (
  <Box display="flex" flexDirection="row" justifyContent="space-between" maxWidth="300px">
    <Chip {...args} />
    <Chip color="success" {...args} />
    <Chip color="warning" {...args} />
    <Chip color="error" {...args} />
    <Chip color="info" {...args} />
  </Box>
)

export const Default = Template.bind({})

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  label: 'hello'
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
