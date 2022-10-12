import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Box, Button } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Button> = (args) => (
  <Box
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    maxWidth="600px"
    flexWrap="wrap"
  >
    <Button size="small" {...args} />
    <Button {...args} />
    <Button size="large" {...args} />
    <Button size="xl" {...args} />
    <Button size="2xl" {...args} />
  </Box>
)

export const Outlined = Template.bind({})
export const OutlinedDisabled = Template.bind({})
export const Contained = Template.bind({})
export const ContainedDisabled = Template.bind({})
export const ContainedSecondary = Template.bind({})
export const ContainedSecondaryDisabled = Template.bind({})
export const TextButton = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Outlined.args = {
  variant: 'outlined',
  children: 'Hello',
  disabled: false
}
OutlinedDisabled.args = {
  variant: 'outlined',
  children: 'Hello',
  disabled: true
}
Contained.args = {
  variant: 'contained',
  children: 'Hello'
}
ContainedSecondary.args = {
  variant: 'contained',
  color: 'secondary',
  children: 'Hello'
}
ContainedDisabled.args = {
  variant: 'contained',
  children: 'Hello',
  disabled: true
}
ContainedSecondaryDisabled.args = {
  variant: 'contained',
  color: 'secondary',
  children: 'Hello',
  disabled: true
}
TextButton.args = {
  variant: 'text',
  children: 'Hello'
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
