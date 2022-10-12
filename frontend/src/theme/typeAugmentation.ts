export {}
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
