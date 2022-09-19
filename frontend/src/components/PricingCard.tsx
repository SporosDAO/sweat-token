import { Box, Button, Card, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { borderRadius } from '@mui/system'
import { FC } from 'react'

export interface SPOROSPricingCardProps {
  name?: string
}

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'template'
})<SPOROSPricingCardProps>(({ theme }) => ({
  width: '476px',
  borderRadius: '16px',
  border: `1px solid ${theme.colors.gray[200]}`,
  boxShadow: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);',
  padding: '32px'
}))

/**
 * Component for Displaying PricingCard
 */
const PricingCard: React.FunctionComponent<SPOROSPricingCardProps> = () => {
  const theme = useTheme()
  return (
    <StyledCard>
      <Button variant="contained">Hello</Button>
      <Box display="flex" flexDirection="column">
        <>Testing</>
        <Box marginX={'-32px'} marginBottom="-32px" height="112px" sx={{ backgroundColor: '#eee' }}>
          <Box display="flex" justifyContent="center" padding="32px">
            <Button
              fullWidth
              sx={{
                padding: '12px 20px',
                backgroundColor: theme.colors.primary[500],
                border: `1px solid ${theme.colors.primary[600]}`,
                boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                borderRadius: '8px',
                height: '48px'
              }}
              variant="contained"
            >
              Hello
            </Button>
          </Box>
        </Box>
      </Box>
    </StyledCard>
  )
}

export default PricingCard
