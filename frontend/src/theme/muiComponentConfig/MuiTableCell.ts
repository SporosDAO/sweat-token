import { Components } from '@mui/material'
import { colors } from '../colorPalette'
export const MuiTableCell: Components['MuiTableCell'] = {
  styleOverrides: {
    root: {
      padding: '16px 24px',
      fontSize: '14px',
      lineHeight: '20px'
    },
    head: {
      color: colors.gray[500],
      fontSize: '12px',
      padding: '13px 24px',
      fontWeight: 500,
      lineHeight: '16px'
    }
  }
}
