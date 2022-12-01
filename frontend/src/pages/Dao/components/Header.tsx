import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'

type Props = {
  title: string
  subtitle: string
}

const Header: React.FC<Props> = (props) => {
  const { palette } = useTheme()

  return (
    <>
      <Typography variant="h6" mb="4px">
        {props.title}
      </Typography>
      <Typography variant="subtitle2" color={palette.grey[700]}>
        {props.subtitle}
      </Typography>
      palette
      <Divider orientation="horizontal" sx={{ m: '20px 0 24px' }} />
    </>
  )
}
export default Header
