import { createTheme } from '@mui/material'
import { colors } from './colorPalette'
import { MuiComponentConfig } from './muiComponentConfig'
import './typeAugmentation.ts'

export const lightTheme = createTheme({
  palette: MuiComponentConfig.Palette,
  typography: MuiComponentConfig.Typography,
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
    MuiButton: MuiComponentConfig.Button,
    MuiCard: MuiComponentConfig.Card,
    MuiChip: MuiComponentConfig.Chip,
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiTextField: MuiComponentConfig.TextField
  }
})
