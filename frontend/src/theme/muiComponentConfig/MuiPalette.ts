import { ThemeOptions } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiPaletteConfig: ThemeOptions['palette'] = {
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
}
