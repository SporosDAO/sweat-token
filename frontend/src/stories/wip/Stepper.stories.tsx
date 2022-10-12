import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Box, Step, StepLabel, Stepper } from '@mui/material'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WIP/Stepper',
  component: Stepper,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof Stepper>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Stepper> = (args) => <Stepper {...args} />

const steps = ['Select master blaster campaign settings', 'Create an ad group', 'Create an ad']

export const Default = () => (
  <Box sx={{ width: '100%' }}>
    <Stepper activeStep={1} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  </Box>
)

// More on args: https://storybook.js.org/docs/react/writing-stories/args
