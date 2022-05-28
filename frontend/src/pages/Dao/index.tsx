import { Outlet } from 'react-router-dom'
import { DaoProvider } from '../../context/DaoContext'
import { PageProvider } from '../../context/PageContext'
import { PageLayout } from '../../layout/Page'

export default function Dao() {
  return (
    <DaoProvider>
      <PageProvider>
        <PageLayout>
          <Outlet />
        </PageLayout>
      </PageProvider>
    </DaoProvider>
  )
}
