import { Box, Typography } from '@mui/material'

export default function LabeledValue(props: { label: string; children: React.ReactNode }): JSX.Element {
  const { label, children } = props
  return (
    <Box sx={{ mt: 1 }}>
      <Typography sx={{ fontWeight: 'bold', mt: 1 }}>{label}:</Typography>
      {typeof children === 'string' ? <Typography>{children}</Typography> : <>{children}</>}
    </Box>
  )
}
