import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  padding: '10px 16px',

  fontWeight: 500,
  boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
  borderRadius: '8px',
  height: '48px',
  textTransform: 'none',
  '&.MuiButton-outlined': {
    color: theme.colors.gray[700],
    border: `1px solid ${theme.colors.gray[300]}`,
    '&.Mui-disabled': {
      color: theme.colors.gray[200],
      border: `1px solid ${theme.colors.gray[200]}`
    }
  },
  '&.MuiButton-containedPrimary': {
    backgroundColor: theme.colors.primary[500],
    border: `1px solid ${theme.colors.primary[600]}`,
    color: '#fff',
    '&.Mui-disabled': {
      backgroundColor: theme.colors.gray[200],
      border: `1px solid ${theme.colors.gray[200]}`
    }
  }
}))

export default StyledButton
