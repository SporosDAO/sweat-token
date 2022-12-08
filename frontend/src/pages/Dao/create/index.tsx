import { Outlet } from 'react-router-dom'
import { PageLayout } from '../../../layout/Page'
export default function DaoCreate() {
  return (
    <PageLayout withDrawer={false}>
      <Outlet />
    </PageLayout>
  )
}
