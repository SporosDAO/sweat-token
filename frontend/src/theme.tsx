import { createTheme } from '@mui/material'
import { colors } from './colorPalette'

declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      gray: {
        900: React.CSSProperties['color']
        800: React.CSSProperties['color']
        700: React.CSSProperties['color']
        500: React.CSSProperties['color']
        400: React.CSSProperties['color']
        300: React.CSSProperties['color']
        200: React.CSSProperties['color']
        100: React.CSSProperties['color']
        50: React.CSSProperties['color']
      }
      primary: {
        100: React.CSSProperties['color']
        500: React.CSSProperties['color']
        600: React.CSSProperties['color']
        700: React.CSSProperties['color']
      }
      blue: {
        700: React.CSSProperties['color']
      }
      purple: {
        700: React.CSSProperties['color']
        50: React.CSSProperties['color']
      }
      error: {
        700: React.CSSProperties['color']
        600: React.CSSProperties['color']
        25: React.CSSProperties['color']
      }
      success: {
        700: React.CSSProperties['color']
        50: React.CSSProperties['color']
      }
      warning: {
        700: React.CSSProperties['color']
        50: React.CSSProperties['color']
      }
    }
  }
  interface ThemeOptions {
    colors: {
      gray: {
        900: React.CSSProperties['color']
        800: React.CSSProperties['color']
        700: React.CSSProperties['color']
        500: React.CSSProperties['color']
        400: React.CSSProperties['color']
        300: React.CSSProperties['color']
        200: React.CSSProperties['color']
        100: React.CSSProperties['color']
        50: React.CSSProperties['color']
      }
      primary: {
        50: React.CSSProperties['color']
        100: React.CSSProperties['color']
        500: React.CSSProperties['color']
        600: React.CSSProperties['color']
        700: React.CSSProperties['color']
      }
      blue: {
        700: React.CSSProperties['color']
      }
      purple: {
        700: React.CSSProperties['color']
        50: React.CSSProperties['color']
      }
      error: {
        700: React.CSSProperties['color']
        600: React.CSSProperties['color']
        25: React.CSSProperties['color']
      }
      success: {
        700: React.CSSProperties['color']
        50: React.CSSProperties['color']
      }
      warning: {
        700: React.CSSProperties['color']
        50: React.CSSProperties['color']
      }
    }
  }
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  typography: {
    allVariants: {
      fontFamily: ['Inter'].join(','),
      fontSize: 15
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: Inter
        }`
    }
  },
  colors: colors
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light'
    // primary: {
    //   main: colors.primary[700]
    // },
    // secondary: {
    //   main: colors.gray[900]
    // }
  },
  typography: {
    allVariants: {
      fontFamily: ['Inter'].join(','),
      fontSize: 15
    }
  },
  colors: colors,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: Inter
        }`
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    }
  }
})
