import { createTheme } from '@mui/material'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    allVariants: {
      fontFamily: ['Roboto'].join(','),
      fontSize: 15
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: Roboto
        }`
    }
  }
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light'
  }
})
