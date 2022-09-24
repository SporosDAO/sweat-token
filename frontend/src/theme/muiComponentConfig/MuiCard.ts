import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiCardConfig: Components['MuiCard'] = {
  styleOverrides: {
    root: {
      padding: '15px',
      '&.MuiPaper-outlined, &.MuiPaper-elevation0': {
        border: `1px solid ${colors.gray[100]}`,
        borderRadius: '6px'
      },
      '&.MuiPaper-elevation1': {
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: '8px',
        boxShadow: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
        '& .MuiCardHeader-root': {
          '& .MuiCardHeader-title': {
            fontWeight: 500,
            lineHeight: '24px',
            color: `${colors.gray[900]}`
          }
        }
      }
    }
  }
}
