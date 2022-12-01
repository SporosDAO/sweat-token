import ContentBlock from '../../components/ContentBlock'
import MyDAOs from '../Dao/components/MyDAOs'
import { PageLayout } from '../../layout/Page'

export default function Landing() {
  return (
    <PageLayout withDrawer={false}>
      <ContentBlock title="Your DAOs" /* cta={{ href: 'create-dao', text: 'Create a new DAO' }} */ sx={{ p: 2 }}>
        <MyDAOs />
      </ContentBlock>
<<<<<<< HEAD
      <ContentBlock title="Your DAOs" cta={{ href: 'create-dao', text: 'Create a new DAO' }}>
        <MyDAOs />
      </ContentBlock>
=======
>>>>>>> dbe81aefa88bd00a37bb7c9747521a4dc84a626f
    </PageLayout>
  )
}
