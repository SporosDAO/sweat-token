import { Components } from '@mui/material'
import { colors } from '../colorPalette'
export const MuiTableHead: Components['MuiTableHead'] = {
  styleOverrides: {
    root: {
      backgroundColor: colors.gray[100]
    }
  }
}
