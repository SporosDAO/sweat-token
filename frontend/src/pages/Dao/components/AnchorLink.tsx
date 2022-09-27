import Typography from '@mui/material/Typography'

import { colors } from '../../../theme/colorPalette'

export const AnchorLink: React.FC<{ children: React.ReactNode; href: string; sx?: React.CSSProperties }> = ({
  sx,
  children,
  href
}) => (
  <Typography
    href={href}
    component="a"
    variant="subtitle2"
    rel="noreferrer"
    target="_blank"
    sx={{ cursor: 'pointer', textDecoration: 'underline', color: colors.primary[700], ...sx }}
  >
    {children}
  </Typography>
)
