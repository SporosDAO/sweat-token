import { Components } from '@mui/material'

export const MuiCardConfig: Components['MuiCard'] = {
  styleOverrides: {
    root: {
      margin: 0,
      borderColor: '#E3E8EF', // replace with colors from colorPalette
      '&.founder-card': {
        padding: '15px',
        marginBottom: '24px',
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        borderRadius: '6px',
        background: '#F8FAFC',
        border: '1px solid #EEF2F6'
      },
      '&.payment-card': {
        borderRadius: '16px',
        background: '#FFFFFF',
        border: '1px solid #E3E8EF',
        boxShadow: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        '.card-footer': {
          padding: '32px',
          background: '#F8FAFC',
          borderRadius: '0 0 16px 16px'
        }
      }
    }
  }
}
