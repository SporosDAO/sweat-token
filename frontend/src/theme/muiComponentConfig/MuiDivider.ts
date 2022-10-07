import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiDividerConfig: Components['MuiDivider'] = {
  styleOverrides: {
    root: {
      borderColor: colors.gray[200]
    }
  }
}
