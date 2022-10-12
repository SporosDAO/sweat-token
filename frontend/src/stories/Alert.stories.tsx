import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Alert } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Alert',
  component: Alert,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Alert>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Default = () => (
  <>
    <Alert severity="error">This is an error alert — check it out!</Alert>
    <br />
    <Alert severity="warning">This is a warning alert — check it out!</Alert>
    <br />
    <Alert severity="info">This is an info alert — check it out!</Alert>
    <br />
    <Alert severity="success">This is a success alert — check it out!</Alert>
  </>
)
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
