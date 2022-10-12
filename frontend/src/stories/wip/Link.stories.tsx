import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Link } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WIP/Link',
  component: Link,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Link>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Link> = (args) => <Link {...args} />

export const Default = () => (
  <>
    <Link href="#">Link</Link>
    <Link href="#" color="inherit">
      {'color="inherit"'}
    </Link>
    <Link href="#" variant="body2">
      {'variant="body2"'}
    </Link>
  </>
)
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
