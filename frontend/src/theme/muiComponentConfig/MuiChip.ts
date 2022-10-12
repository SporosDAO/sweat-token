import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiChipConfig: Components['MuiChip'] = {
  styleOverrides: {
    root: {
      padding: '2px 8px',
      '&.MuiChip-filledDefault': {
        background: colors.gray[100],
        color: colors.gray[700]
      }
    },
    label: {
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: 'Inter',
      padding: '0px'
    },
    sizeMedium: {
      height: '22px'
    }
  }
}
