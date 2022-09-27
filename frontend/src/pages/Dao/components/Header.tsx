import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { colors } from '../../../theme/colorPalette'

type Props = {
  title: string
  subtitle: string
}

const Header: React.FC<Props> = (props) => (
  <>
    <Typography variant="h6" mb="4px">
      {props.title}
    </Typography>
    <Typography variant="subtitle2" color={colors.gray[700]}>
      {props.subtitle}
    </Typography>
    <Divider orientation="horizontal" sx={{ m: '20px 0 24px' }} />
  </>
)

export default Header
