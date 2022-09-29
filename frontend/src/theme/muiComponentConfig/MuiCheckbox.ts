import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiCheckboxConfig: Components['MuiCheckbox'] = {
  styleOverrides: {
    root: {
      background: colors.primary[50],
      borderRadius: '4px',
      border: `1px solid ${colors.primary[600]}`
    }
  }
}
