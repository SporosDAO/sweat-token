import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Box, useTheme } from '@mui/material'

type Props = {
  title: string
  subtitle: string
}

const Header: React.FC<Props> = (props) => {
  const { palette } = useTheme()

  return (
    <Box data-testid="content-header">
      <Typography variant="h6" mb="4px">
        {props.title}
      </Typography>
      <Typography variant="subtitle2" color={palette.text.secondary}>
        {props.subtitle}
      </Typography>
      <Divider orientation="horizontal" sx={{ m: '20px 0 24px' }} />
    </Box>
  )
}
export default Header
