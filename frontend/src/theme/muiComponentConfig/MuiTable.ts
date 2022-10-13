import { Components } from '@mui/material'
import { colors } from '../colorPalette'
export const MuiTable: Components['MuiTable'] = {
  styleOverrides: {
    root: {
      border: `1px solid ${colors.gray[200]}`,
      borderRadius: '8px'
    }
  }
}
