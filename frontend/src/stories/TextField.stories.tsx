import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TextField } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/TextField',
  component: TextField,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof TextField>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof TextField> = (args) => (
  <TextField label="This is a Label" placeholder="This is a Placeholder" helperText="This is a helper" {...args} />
)

export const Default = Template.bind({})
export const Error = Template.bind({})
export const Disabled = Template.bind({})

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  disabled: false,
  error: false
}

Error.args = {
  disabled: false,
  error: true
}

Disabled.args = {
  disabled: true,
  error: false
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
