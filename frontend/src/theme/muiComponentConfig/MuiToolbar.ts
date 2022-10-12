import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiToolbarConfig: Components['MuiToolbar'] = {
  styleOverrides: {
    root: {
      '& .MuiButtonBase-root': {
        color: colors.gray[700]
      }
    }
  }
}
