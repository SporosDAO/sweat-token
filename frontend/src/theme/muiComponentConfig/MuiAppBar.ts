import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiAppBarConfig: Components['MuiAppBar'] = {
  defaultProps: {
    elevation: 0
  },
  styleOverrides: {
    root: {
      paddingLeft: '32px',
      paddingRight: '32px',
      color: colors.gray[700],
      alignContent: 'center',
      background: '#fff',
      minHeight: '72px',
      borderBottom: `1px solid ${colors.gray[200]}`,
      '& .MuiToolbar-root': {
        minHeight: '72px'
      }
    }
  }
}
