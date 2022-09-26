import Header from '../components/Header'
import { FormikValues, FormikHandlers } from 'formik'

const Structure: React.FC<Partial<FormikValues & FormikHandlers>> = ({ values, handleChange }) => (
  <>
    <Header title="Structure" subtitle="Your Series LLC will be incorporated in Delaware, USA." />
  </>
)

export default Structure
