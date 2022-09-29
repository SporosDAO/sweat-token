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
    MuiCheckbox: MuiComponentConfig.Checkbox,
    MuiDivider: MuiComponentConfig.Divider,
    MuiTooltip: MuiComponentConfig.Tooltip,
    MuiPaper: {
      defaultProps: {
        elevation: 0
      }
    },
    MuiTab: MuiComponentConfig.Tab,
    MuiTextField: MuiComponentConfig.TextField,
    MuiPagination: MuiComponentConfig.Pagination,
    MuiModal: MuiComponentConfig.Modal,
    MuiDialog: MuiComponentConfig.Dialog
  }
})
