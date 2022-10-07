import { Components } from '@mui/material'

export const MuiCheckboxConfig: Components['MuiCheckbox'] = {
  styleOverrides: {
    root: {
      '&:hover': {
        background: 'none'
      }
    }
  }
}
