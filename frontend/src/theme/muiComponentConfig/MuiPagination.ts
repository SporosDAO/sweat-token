import { Components } from '@mui/material'
import { colors } from '../colorPalette'
export const MuiPaginationConfig: Components['MuiPagination'] = {
  styleOverrides: {
    root: {
      '& .MuiPaginationItem-root': {
        color: colors.gray[500],
        fontSize: '14px',
        '&.Mui-selected': {
          color: colors.gray[800],
          fontWeight: 500,
          backgroundColor: colors.gray[100]
        }
      }
    }
  }
}
