import { Components } from '@mui/material'
import { colors } from '../colorPalette'

export const MuiTextFieldConfig: Components['MuiTextField'] = {
  defaultProps: {
    variant: 'outlined',
    InputProps: {
      notched: false
    },
    InputLabelProps: {
      shrink: true
    }
  },
  styleOverrides: {
    root: {
      '& .MuiInputLabel-outlined': {
        color: colors.gray[700],
        position: 'relative',
        fontSize: '14px',
        fontWeight: 500,
        transform: 'none',
        marginBottom: '6px',
        lineHeight: '20px',
        '&.Mui-focused, &.Mui-disabled, &.Mui-error': {
          color: 'inherit'
        }
      },
      '& .MuiFormHelperText-root': {
        marginLeft: '0px',
        fontSize: '12px',
        lineHeight: '18px',
        marginTop: '6px',
        '&.Mui-disabled': {
          color: 'inherit'
        },
        '&.Mui-error': {
          color: colors.error[500]
        }
      },
      '& .MuiOutlinedInput-root': {
        ':hover > .MuiOutlinedInput-notchedOutline': {
          border: `1px solid ${colors.gray[300]}`
        },
        backgroundColor: '#fff',
        borderRadius: '8px',
        '&.Mui-focused > .MuiOutlinedInput-notchedOutline': {
          border: `1px solid ${colors.primary[300]}`,
          boxShadow: `0px 1px 2px rgba(120, 226, 70, 0.05), 0px 0px 0px 4px #DFFECD`
        },
        '&.Mui-focused.Mui-error > .MuiOutlinedInput-notchedOutline': {
          border: `1px solid ${colors.error[300]}`,
          boxShadow: `0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #FEE4E2`
        },
        '&.Mui-disabled': {
          backgroundColor: colors.gray[50]
        },
        '&.Mui-disabled > .MuiOutlinedInput-notchedOutline': {
          border: `1px solid ${colors.gray[300]}`
        },
        '&.Mui-error': {
          '& .MuiOutlinedInput-notchedOutline': {
            border: `1px solid ${colors.error[300]}`
          }
        }
      },

      '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${colors.gray[300]}`,
        boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
      },
      '& input': {
        padding: '10px 14px',
        '&.Mui-disabled': {
          '-webkitTextFillColor': colors.gray[500],
          color: colors.gray[500]
        }
      }
    }
  }
}
