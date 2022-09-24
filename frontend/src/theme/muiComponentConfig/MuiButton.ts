import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiButtonConfig: Components['MuiButton'] = {
  styleOverrides: {
    root: {
      fontWeight: 500,
      boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
      borderRadius: '8px',
      textTransform: 'none',
      ':disabled': {
        border: `1px solid ${colors.gray[200]}`
      },
      ':hover': {
        animationTimingFunction: 'linear',
        animationDuration: '200ms',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
      },
      '&.MuiButton-sizeXl': {
        padding: '12px 20px',
        height: '48px',
        fontSize: '16px'
      },
      '&.MuiButton-size2xl': {
        padding: '16px 28px',
        height: '60px',
        fontSize: '18px'
      }
    },
    sizeMedium: {
      height: '40px',
      padding: '10px 16px',
      fontSize: '14px'
    },
    sizeLarge: {
      height: '44px',
      padding: '10px 16px',
      fontSize: '16px'
    },
    sizeSmall: {
      height: '36px',
      padding: '8px 14px',
      fontSize: '14px'
    },
    text: {
      boxShadow: 'none',
      color: colors.gray[700],
      '&:hover': {
        boxShadow: 'none'
      },
      '&:active': {
        backgroundColor: colors.primary[50],
        color: colors.primary[700]
      }
    },
    outlined: {
      color: colors.gray[700],
      backgroundColor: '#fff',
      border: `1px solid ${colors.gray[300]}`,
      ':disabled': {
        color: colors.gray[200]
      },
      ':hover': {
        backgroundColor: colors.gray[50],
        border: `1px solid ${colors.gray[300]}`
      },
      ':focus': {
        border: `1px solid ${colors.gray[300]}`,
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #F2F4F7'
      }
    },
    containedPrimary: {
      border: `1px solid ${colors.primary[600]}`,
      ':hover': {
        border: `1px solid ${colors.primary[700]}`
      },
      ':focus': {
        backgroundColor: colors.primary[500],
        border: `1px solid ${colors.primary[500]}`,
        boxShadow: '0px 1px 2px rgba(120, 226, 70, 0.05), 0px 0px 0px 4px #DFFECD'
      },
      ':disabled': {
        backgroundColor: colors.gray[200],
        border: `1px solid ${colors.gray[200]}`,
        color: '#fff'
      }
    },
    containedSecondary: {
      boxShadow: 'none',
      ':hover': {
        boxShadow: 'none'
      },
      ':focus': {
        boxShadow: '0px 1px 2px rgba(120, 226, 70, 0.05), 0px 0px 0px 4px #DFFECD'
      },
      ':disabled': {
        backgroundColor: colors.primary[25],
        border: 'none',
        color: colors.primary[300]
      }
    }
  }
}
