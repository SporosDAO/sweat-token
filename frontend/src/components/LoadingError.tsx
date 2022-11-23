import { Box, Button } from '@mui/material'

export default function LoadingError() {
  return (
    <Box data-testid="loading-error">
      Failed to load data.{' '}
      <Button
        data-testid="retry-btn"
        onClick={(e) => {
          e.preventDefault()
        }}
        aria-label="retry"
      >
        Retry
      </Button>
    </Box>
  )
}
