import { Components } from '@mui/material'

export const MuiDividerConfig: Components['MuiDivider'] = {
  styleOverrides: {
    root: {
      borderColor: '#E3E8EF', // replace with colors from colorPalette
      '&.MuiDivider-fullWidth': {
        margin: '20px 0 24px'
      }
    }
  }
}
