import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { IconButton, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WIP/Tooltip',
  component: Tooltip,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Tooltip>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Tooltip> = (args) => <Tooltip {...args} />

export const Default = () => (
  <Tooltip title="Delete">
    <IconButton>
      <DeleteIcon />
    </IconButton>
  </Tooltip>
)
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
