import { useEffect, useState } from 'react'
import MyDAOs from '../Dao/components/MyDAOs'
import ContentBlock from '../../components/ContentBlock'
import { PageLayout } from '../../layout/Page'

const Landing: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [failed] = useState(false)

  useEffect(() => {
    if (loading) return
    if (failed) return
    setLoading(true)
  }, [failed, loading])

  return (
    <PageLayout withDrawer={false}>
      <ContentBlock>
        <h1>The Launchpad of For-Profit DAOs</h1>
      </ContentBlock>
      <ContentBlock title="Your DAOs" cta={{ href: 'dao/create', text: 'Create a new DAO' }}>
        <MyDAOs />
      </ContentBlock>
    </PageLayout>
  )
}

export default Landing
