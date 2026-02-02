import { Typography } from '@mui/material'
import { useTheme } from '@mui/material'

export const AnchorLink: React.FC<{ children: React.ReactNode; href: string; sx?: React.CSSProperties }> = ({
  sx,
  children,
  href
}) => {
  const { palette } = useTheme()

  return (
    <Typography
      href={href}
      component="a"
      variant="subtitle2"
      rel="noreferrer"
      target="_blank"
      sx={{ cursor: 'pointer', textDecoration: 'underline', color: palette.primary.dark, ...sx }}
    >
      {children}
    </Typography>
  )
}
