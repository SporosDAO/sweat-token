import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Breadcrumbs } from '@mui/material'
import { Link, Typography } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WIP/Breadcrumbs',
  component: Breadcrumbs,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Breadcrumbs>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Breadcrumbs> = (args) => <Breadcrumbs {...args} />

export const Default = () => (
  <Breadcrumbs aria-label="breadcrumb">
    <Link underline="hover" color="inherit" href="/">
      MUI
    </Link>
    <Link underline="hover" color="inherit" href="/material-ui/getting-started/installation/">
      Core
    </Link>
    <Typography color="text.primary">Breadcrumbs</Typography>
  </Breadcrumbs>
)
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
