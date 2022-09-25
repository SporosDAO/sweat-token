import { createTheme } from '@mui/material'
import { colors } from './colorPalette'
import { MuiComponentConfig } from './muiComponentConfig'
import './typeAugmentation.ts'

export const lightTheme = createTheme({
  palette: MuiComponentConfig.Palette,
  typography: MuiComponentConfig.Typography,
  colors: colors,
  spacing: 4,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: Inter
        }`
    },
    MuiGrid: {
      defaultProps: {
        spacing: 8
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiAppBar: MuiComponentConfig.AppBar,
    MuiToolbar: MuiComponentConfig.Toolbar,
    MuiButton: MuiComponentConfig.Button,
    MuiCard: MuiComponentConfig.Card,
    MuiChip: MuiComponentConfig.Chip,
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiTextField: MuiComponentConfig.TextField,
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            color: colors.gray[500],
            fontSize: '14px',
            '&.Mui-selected': {
              color: colors.gray[800],
              fontWeight: 500,
              backgroundColor: colors.gray[100]
            }
          }
        }
      }
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            background: 'rgba(52, 64, 84, 0.7)',
            backdropFilter: 'blur(8px)'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          boxShadow: '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)'
        }
      }
    }
  }
})
