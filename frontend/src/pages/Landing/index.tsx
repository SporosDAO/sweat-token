import { Box, Grid, SxProps, Theme, Typography } from '@mui/material'
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
    minHeight: '13em'
  }

  return (
    <PageLayout withDrawer={false}>
      <ContentBlock title="Your DAOs" /* cta={{ href: 'create-dao', text: 'Create a new DAO' }} */ sx={{ p: 2 }}>
        <MyDAOs />
      </ContentBlock>
    </PageLayout>
  )
}
