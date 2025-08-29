import { useEffect, useState } from 'react'
import MyDAOs from '../Dao/components/MyDAOs'
import ContentBlock from '../../components/ContentBlock'
import { PageLayout } from '../../layout/Page'
import { useAccount, useNetwork } from 'wagmi'

const Landing: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [failed] = useState(false)

  const { chain } = useNetwork()
  const { isDisconnected } = useAccount()

  // console.debug({ chain, isDisconnected })

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
      {!chain || isDisconnected ? (
        <div>Please connect your web3 wallet.</div>
      ) : (
        <ContentBlock title="Your DAOs" cta={{ href: `dao/chain/${chain?.id}/create/`, text: 'Create a new company' }}>
          <MyDAOs />
        </ContentBlock>
      )}
    </PageLayout>
  )
}

export default Landing
