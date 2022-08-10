import { createTheme } from '@mui/material'

export default createTheme({
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
