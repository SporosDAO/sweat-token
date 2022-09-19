import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import Button from '../components/Button'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Outlined = Template.bind({})
export const OutlinedDisabled = Template.bind({})
export const Contained = Template.bind({})
export const ContainedDisabled = Template.bind({})

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
ContainedDisabled.args = {
  variant: 'contained',
  children: 'Hello',
  disabled: true
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
