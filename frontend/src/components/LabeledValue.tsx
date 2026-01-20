import { Box, Typography } from '@mui/material'

export default function LabeledValue(props: { label: string; children: React.ReactNode }): JSX.Element {
  const { label, children, ...otherProps } = props
  return (
    <Box sx={{ mt: 1 }} {...otherProps}>
      <Typography sx={{ fontWeight: 'bold', mt: 1 }}>{label}:</Typography>
      {typeof children === 'string' ? <Typography>{children}</Typography> : <>{children}</>}
    </Box>
  )
}
