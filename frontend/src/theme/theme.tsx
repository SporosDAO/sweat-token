import { createTheme } from '@mui/material'
import { colors } from './colorPalette'
import { MuiChipConfig } from './components/MuiChip'
import { MuiButtonConfig } from './components/MuiButton'
import { MuiCardConfig } from './components/MuiCard'
import { MuiTextFieldConfig } from './components/MuiTextField'

declare module '@mui/material/Button' {
  interface ButtonPropsSizeOverrides {
    xl: true
    '2xl': true
  }
  interface ButtonPropsColorOverrides {
    tertiaryGray: true
    tertiaryColor: true
  }
}
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
        25: React.CSSProperties['color']
      }
      primary: {
        25: React.CSSProperties['color']
        50: React.CSSProperties['color']
        100: React.CSSProperties['color']
        300: React.CSSProperties['color']
        500: React.CSSProperties['color']
        600: React.CSSProperties['color']
        700: React.CSSProperties['color']
        900: React.CSSProperties['color']
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
        500: React.CSSProperties['color']
        300: React.CSSProperties['color']
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
        25: React.CSSProperties['color']
      }
      primary: {
        25: React.CSSProperties['color']
        50: React.CSSProperties['color']
        100: React.CSSProperties['color']
        300: React.CSSProperties['color']
        500: React.CSSProperties['color']
        600: React.CSSProperties['color']
        700: React.CSSProperties['color']
        900: React.CSSProperties['color']
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
        500: React.CSSProperties['color']
        300: React.CSSProperties['color']
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
    mode: 'light',
    background: {
      default: colors.gray[25]
    },
    primary: {
      main: colors.primary[500],
      dark: colors.primary[600],
      light: colors.primary[500],
      contrastText: '#fff'
    },
    secondary: {
      main: colors.primary[50],
      dark: colors.primary[100],
      light: colors.primary[25],
      contrastText: colors.primary[900]
    },
    success: {
      main: colors.success[50],
      dark: colors.success[700],
      light: colors.success[50],
      contrastText: colors.success[700]
    },
    warning: {
      main: colors.warning[50],
      dark: colors.warning[700],
      light: colors.warning[50],
      contrastText: colors.warning[700]
    },
    error: {
      main: colors.error[50],
      dark: colors.error[700],
      light: colors.error[50],
      contrastText: colors.error[700]
    },
    info: {
      main: colors.blue[50],
      dark: colors.blue[700],
      light: colors.blue[50],
      contrastText: colors.blue[700]
    }
  },
  typography: {
    allVariants: {
      fontFamily: ['Inter'].join(','),
      fontSize: 16
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
    },
    MuiButton: MuiButtonConfig,
    MuiCard: MuiCardConfig,
    MuiChip: MuiChipConfig,
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiTextField: MuiTextFieldConfig
  }
})
