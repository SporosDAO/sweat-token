import { Components } from '@mui/material'

// @todo - remove these styles and replace with component library buttons
export const MuiButtonConfig: Components['MuiButton'] = {
  styleOverrides: {
    root: {
      margin: 0,
      borderColor: '#E3E8EF', // replace with colors from color palette
      '&.founder-button': {
        padding: '8px 14px',
        textTransform: 'none',
        height: '36px',
        background: '#F5FBEE',
        border: '1px solid #F5FBEE',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'Inter',
        fontWeight: 500,
        letterSpacing: 0,
        fontSize: '14px',
        cursor: 'pointer',
        lineHeight: '20px',
        color: '#2B5314'
      },
      '&.bridge-button': {
        padding: ' 10px 16px',
        color: '#364152',
        height: '40px',
        background: '#FFFFFF',
        border: '1px solid #CDD5DF',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        borderRadius: '8px',
        cursor: 'pointer',
        textTransform: 'none'
      },
      '&.pay-now': {
        background: '#4AB733',
        border: '1px solid #4CA30D',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        borderRadius: '8px',
        padding: '12px 20px',
        width: '100%',
        height: '48px',
        color: '#fff',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        textTransform: 'none'
      }
    }
  }
}
