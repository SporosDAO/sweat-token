import { darkTheme, lightTheme } from '../src/theme'
import { ThemeProvider, CssBaseline } from '@mui/material'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'dark',
    toolbar: {
      icon: 'circlehollow',
      // Array of plain string values or MenuItem shape (see below)
      items: ['light', 'dark'],
      // Property that specifies if the name of the item will be displayed
      showName: true
    }
  }
}

export const decorators = [
  (Story, options) => {
    const { globals } = options
    const theme = globals.theme === 'dark' ? darkTheme : lightTheme
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    )
  }
]
