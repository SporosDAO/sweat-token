import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Switch } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WIP/Switch',
  component: Switch,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Switch>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
