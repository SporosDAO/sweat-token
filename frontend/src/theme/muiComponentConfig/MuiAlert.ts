import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiAlert: Components['MuiAlert'] = {
  styleOverrides: {
    root: {
      '& .MuiAlert-message': {
        fontSize: '14px'
      }
    },
    standardError: {
      backgroundColor: colors.error[25],
      border: `1px solid ${colors.error[300]}`,
      borderRadius: '8px',
      '& .MuiAlert-message': {
        color: colors.error[600]
      },
      '& .MuiAlert-icon': {
        color: colors.error[600]
      }
    },
    standardWarning: {
      backgroundColor: colors.warning[25],
      border: `1px solid ${colors.warning[300]}`,
      borderRadius: '8px',
      '& .MuiAlert-message': {
        color: colors.warning[600]
      },
      '& .MuiAlert-icon': {
        color: colors.warning[600]
      }
    },
    standardInfo: {
      backgroundColor: colors.gray[25],
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: '8px',
      '& .MuiAlert-message': {
        color: colors.gray[700]
      },
      '& .MuiAlert-icon': {
        color: colors.gray[700]
      }
    },
    standardSuccess: {
      backgroundColor: colors.success[25],
      border: `1px solid ${colors.success[300]}`,
      borderRadius: '8px',
      '& .MuiAlert-message': {
        color: colors.success[600]
      },
      '& .MuiAlert-icon': {
        color: colors.success[600]
      }
    }
  }
}
