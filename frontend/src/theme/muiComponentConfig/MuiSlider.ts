import { Components } from '@mui/material'
import { colors } from '../colorPalette'
export const MuiSliderConfig: Components['MuiSlider'] = {
  styleOverrides: {
    root: {
      height: '8px'
    },
    thumbColorPrimary: {
      height: '24px',
      width: '24px',
      backgroundColor: '#fff',
      border: `2px solid ${colors.primary[600]}`,
      '&:hover': {
        boxShadow: 'none'
      },
      '&.Mui-focusVisible': {
        boxShadow: 'none'
      }
    },
    rail: {
      backgroundColor: colors.gray[200],
      opacity: 1
    }
  }
}
