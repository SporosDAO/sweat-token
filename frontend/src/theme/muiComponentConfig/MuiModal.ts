import { Components } from '@mui/material'

export const MuiModalConfig: Components['MuiModal'] = {
  styleOverrides: {
    root: {
      '& .MuiBackdrop-root': {
        background: 'rgba(52, 64, 84, 0.7)',
        backdropFilter: 'blur(8px)'
      }
    }
  }
}
