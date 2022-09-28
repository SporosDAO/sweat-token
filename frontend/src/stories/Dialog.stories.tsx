import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Box, Dialog } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Dialog',
  component: Dialog,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Dialog>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Dialog> = (args) => (
  <Box>
    content under the dialog
    <Dialog {...args}>
      <Box padding="10px" width="300px" height="300px">
        Hello this is an example dialog
      </Box>
    </Dialog>
  </Box>
)

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  open: true
}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
