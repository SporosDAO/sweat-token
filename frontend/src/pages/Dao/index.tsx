import { Outlet } from 'react-router-dom'
import { PageLayout } from '../../layout/Page'

export default function Dao() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  )
}
