import Typography from '@mui/material/Typography'

export const AnchorLink: React.FC<{ children: React.ReactNode; href: string; sx?: React.CSSProperties }> = ({
  sx,
  children,
  href
}) => (
  <Typography
    href={href}
    component="a"
    variant="label"
    rel="noreferrer"
    target="_blank"
    sx={{ cursor: 'pointer', textDecoration: 'underline', color: '#3B7C0F', ...sx }}
  >
    {children}
  </Typography>
)
