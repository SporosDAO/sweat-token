import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Card, CardContent, CardHeader } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Card',
  component: Card,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Card>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Card> = (args) => (
  <>
    <Card {...args}>
      <CardHeader title="Header" />
      <CardContent>test</CardContent>
    </Card>
  </>
)

export const Outlined = Template.bind({})
export const Default = Template.bind({})
export const Elevation = Template.bind({})

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Outlined.args = {
  variant: 'outlined'
}
Default.args = {}
Elevation.args = {
  elevation: 1
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
