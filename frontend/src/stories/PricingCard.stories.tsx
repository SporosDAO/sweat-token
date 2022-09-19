import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import PricingCard from '../components/PricingCard'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/PricingCard',
  component: PricingCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {}
} as ComponentMeta<typeof PricingCard>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof PricingCard> = (args) => <PricingCard {...args} />

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {}

// More on args: https://storybook.js.org/docs/react/writing-stories/args
