import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

type Props = {
  title: string
  subtitle: string
}

const Header: React.FC<Props> = (props) => (
  <>
    <Typography variant="h2" sx={{ mb: '4px' }}>
      {props.title}
    </Typography>
    <Typography variant="subtitle1" sx={{ color: '#364152' }}>
      {props.subtitle}
    </Typography>
    <Divider orientation="horizontal" />
  </>
)

export default Header
