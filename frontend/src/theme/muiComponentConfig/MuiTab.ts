import { Components } from '@mui/material'

export const MuiTabConfig: Components['MuiTab'] = {
  styleOverrides: {
    root: {
      minHeight: '30px',
      paddingTop: '6px',
      textTransform: 'none',
      paddingBottom: '6px',
      alignItems: 'flex-start',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
      // color: '#202939' // complete state - replace with colors from colorPalette
      color: '#697586', // incomplete state - replace with colors from colorPalette
      borderLeft: '2px solid #EEF2F6', // replace with colors from colorPalette
      '&.MuiTab-root.Mui-selected': {
        color: '#4CA30D !important'
      }
    }
  }
}
