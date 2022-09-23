import { createTheme } from '@mui/material'

import { MuiTabConfig } from './components/MuiTab'
import { MuiDividerConfig } from './components/MuiDivider'
import { MuiCardConfig } from './components/MuiCard'
import { MuiButtonConfig } from './components/MuiButton'

declare module '@mui/material/styles' {
  interface TypographyVariants {
    title: React.CSSProperties
    label: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    title?: React.CSSProperties
    label?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    title: true
    label: true
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
        body {
          margin: 0;
        }
        @font-face {
          font-family: Inter
        }`
    }
  }
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light'
  },
  typography: {
    h1: {
      fontWeight: 600,
      fontSize: '36px',
      lineHeight: '44px',
      color: '#121926',
      letterSpacing: '-0.02em',
      fontFamily: 'Inter'
    },
    h2: {
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '32px',
      color: '#121926',
      letterSpacing: 0,
      fontFamily: 'Inter'
    },
    body1: {
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: '28px',
      color: '#697586',
      letterSpacing: 0,
      fontFamily: 'Inter'
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      color: '#697586',
      letterSpacing: 0,
      fontFamily: 'Inter'
    },
    caption: {
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '18px',
      color: '#697586',
      letterSpacing: 0,
      fontFamily: 'Inter'
    },
    title: {
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#202939',
      letterSpacing: 0,
      fontFamily: 'Inter'
    },
    label: {
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '20px',
      color: '#364152',
      letterSpacing: 0,
      fontFamily: 'Inter'
    }
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true // No more ripple, on the whole application 💣!
      }
    },
    MuiTab: MuiTabConfig,
    MuiCard: MuiCardConfig,
    MuiDivider: MuiDividerConfig,
    MuiButton: MuiButtonConfig,
    MuiCssBaseline: {
      styleOverrides: `
        body {
          margin: 0;
          min-height: 100vh;
        }
        @font-face {
          font-family: Inter;
        }
        ::placeholder {
          color: #697586;
          opacity: 1;
        }
        .MuiTabs-indicator {
          left: 0 !important;
          background-color: #4CA30D !important;
        }
        .input {
          width: 100%;
          height: 44px;
          padding: 10px 14px;
          background: #FFFFFF;
          border: 1px solid #CDD5DF;
          box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
          border-radius: 8px;
          font-size: 16px;
          line-height: 24px;
          font-family: Inter;
        }
      `
    }
  }
})
