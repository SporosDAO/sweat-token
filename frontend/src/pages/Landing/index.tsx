import { Grid, SxProps, Theme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DaoDto } from '../../api/openapi'
import ContentBlock from '../../components/ContentBlock'
import MyDAOs from '../../components/MyDAOs'
import { PageLayout } from '../../layout/Page'

export default function Landing() {
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [publicDaos, setPublicDaos] = useState<DaoDto[]>()

  useEffect(() => {
    if (publicDaos !== undefined) return
    if (loading) return
    if (failed) return
    setLoading(true)
  }, [failed, loading, publicDaos])

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

      <Grid container>
        <Grid item lg={6}>
          <ContentBlock sx={{ ...blockStyle, ml: 1, mr: 0 }} title="Your DAOs">
            <MyDAOs />
          </ContentBlock>
        </Grid>
        <Grid item lg={6}>
          <ContentBlock sx={{ ...blockStyle }} title="Create a for-profit DAO">
            <p>
              <span>
                <a href="https://app.kali.gg/">Create</a> a new for-profit Kali DAO with legal benefits. Make sure to
                choose Company Series LLC template! Then return here to manage sweat equity projects and more.
              </span>
            </p>
          </ContentBlock>
        </Grid>
      </Grid>
    </PageLayout>
  )
}
