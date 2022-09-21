import { Grid, SxProps, Theme } from '@mui/material'
import { useEffect, useState } from 'react'
import ContentBlock from '../../components/ContentBlock'
import MyDAOs from '../Dao/components/MyDAOs'
import { PageLayout } from '../../layout/Page'

export default function Landing() {
  const [loading, setLoading] = useState(false)
  const [failed] = useState(false)

  useEffect(() => {
    if (loading) return
    if (failed) return
    setLoading(true)
  }, [failed, loading])

  const blockStyle: SxProps<Theme> = {
    m: 1,
    ml: 0,
    p: 2,
    minHeight: '12em'
  }

  return (
    <PageLayout withDrawer={false}>
      <ContentBlock>
        <h1>The Launchpad of For-Profit DAOs</h1>
      </ContentBlock>
      <ContentBlock title="Your DAOs" cta={{ href: 'create-dao', text: 'Create a new DAO' }}>
        <MyDAOs />
      </ContentBlock>
    </PageLayout>
  )
}
