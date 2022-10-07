import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'

import Header from '../components/Header'
import { colors } from '../../../theme/colorPalette'

const Terms: React.FC<any> = () => (
  <>
    <Header title="Terms & conditions" subtitle="Subtitle" />
    <Typography variant="subtitle2" color={colors.gray[700]}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Convallis proin elementum scelerisque facilisi habitasse.
      Amet elit cras ut eu vestibuluxm mattis. Suspendisse condimentum nunc, viverra tempor urna, a. Sed consequat,
      bibendum sit nibh feugiat fringilla libero diam, pellentesque. Elit elementum nec egestas venenatis dapibus
      bibendum bibendum diam. Tortor elementum nunc egestas quam. Dictum facilisi augue malesuada lacus fermentum nunc
      bibendum vel. Interdum volutpat etiam in enim, at dictum. Diam molestie consequat tincidunt a morbi eget fermentum
      tellus donec. Et elit, donec mollis faucibus. Odio tellus arcu eget cras turpis. Nisi pulvinar dolor viverra amet.
      Feugiat ut adipiscing sit eu cursus aliquet id arcu.
    </Typography>
    <Typography variant="subtitle2" color={colors.gray[700]} mt="20px">
      Facilisis pellentesque enim sed donec. Velit vestibulum fermentum egestas aliquam. Commodo tincidunt in tellus
      tincidunt nibh. Nunc nunc commodo ornare sed quam euismod aliquet. Tincidunt fringilla lorem fringilla nullam
      fermentum duis.
    </Typography>
    <Typography variant="subtitle2" color={colors.gray[700]} mt="20px">
      At arcu adipiscing vel enim. Faucibus tincidunt in neque id risus fermentum. A elementum morbi erat nulla interdum
      sagittis, donec. Cursus curabitur aliquet at ornare venenatis commodo. Sapien massa in ornare id scelerisque amet.
      Eget aenean fringilla fringilla purus faucibus sit tincidunt. Nibh nibh id amet massa quis. Egestas quis pretium
      et pretium commodo.
    </Typography>
    <Typography variant="subtitle2" color={colors.gray[700]} mt="20px">
      Ultrices vitae at blandit ac gravida egestas libero adipiscing. Et vitae vitae urna consectetur commodo lorem
      feugiat penatibus. Scelerisque sit tristique blandit nulla sagittis fermentum. At amet egestas in gravida
      fringilla. Nibh eget ullamcorper mi volutpat amet ut ut pharetra, in. Urna, massa odio ipsum sapien ut semper
      justo, sed. Vulputate pellentesque facilisis imperdiet venenatis. Venenatis, nibh faucibus tincidunt viverra ac.
      Sed nullam massa diam sed convallis diam sed. Faucibus interdum adipiscing viverra ultrices sed ultricies. Leo
      pellentesque aliquam massa, mattis convallis porta porttitor. Accumsan, mauris nam diam nec neque habitant potenti
      urna.
    </Typography>
    <Typography variant="subtitle2" color={colors.gray[700]} mt="20px">
      Lorem auctor fermentum, ullamcorper lacus, dolor sit. Euismod quisque nullam blandit lacus nisi, sed. Adipiscing
      nisi gravida platea nunc maecenas. Nibh ornare feugiat sit at etiam. Vestibulum sit facilisis eget quam at.
      Dignissim felis ipsum ultricies non aliquet quis. Euismod id cursus aliquam nunc nunc. Non dolor nulla id
      ullamcorper feugiat integer dui sociis. Viverra sit eu interdum sit enim enim enim dolor. Nisl, viverra at quis
      posuere. Ac fusce vitae arcu, massa eu consectetur odio a. Rhoncus arcu diam magna amet, luctus lorem elementum
      consectetur. Habitant viverra tellus ullamcorper donec at pellentesque et netus.
    </Typography>
    <Typography variant="subtitle2" color={colors.gray[700]} mt="20px">
      In magna ultrices nam aenean fringilla. Sed nec varius turpis mattis habitasse vitae libero, at lobortis.
      Porttitor tellus gravida mauris amet dui. Mi quisque habitant volutpat et, sit tempus. Eleifend lacus, imperdiet
      ante metus, sit malesuada massa semper. Eu lectus elit et viverra tortor velit egestas suspendisse phasellus.
      Mattis vel commodo nulla a ridiculus suspendisse vel consectetur. At non, non quis eu, neque placerat eros.
      Bibendum mattis scelerisque vitae amet massa congue eget nulla.
    </Typography>
    <FormControlLabel
      sx={{ mt: '24px' }}
      label="Agree with terms of use and privacy policy"
      control={
        <Checkbox
          inputProps={{ 'aria-label': 'Terms Checkbox' }}
          icon={<img src="/icons/unchecked.svg" alt="Unchecked" />}
          checkedIcon={<img src="/icons/checked.svg" alt="Unchecked" />}
        />
      }
    />
    <Typography variant="subtitle2" sx={{ mt: '-4px', ml: '24px', color: '#697586' }}>
      In order to continue you will have to accept our terms and conditions. You can read them here.
    </Typography>
  </>
)

export default Terms
