import { Components } from '@mui/material'

export const MuiDialogConfig: Components['MuiDialog'] = {
  styleOverrides: {
    paper: {
      borderRadius: '12px',
      boxShadow: '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)'
    }
  }
}
