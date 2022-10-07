import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiFormControlLabelConfig: Components['MuiFormControlLabel'] = {
  styleOverrides: {
    label: {
      fontSize: '14px',
      lineHeight: '20px',
      fontFamily: 'Inter',
      fontWeight: 500,
      padding: '0px',
      color: colors.gray[700]
    }
  }
}
