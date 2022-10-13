import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Paper } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WIP/Paper',
  component: Paper,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Paper>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Paper> = (args) => <Paper {...args} />

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
