import { Button, CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { findMembers } from '../../api'
import { MemberDto } from '../../api/openapi'
import ContentBlock from '../../components/ContentBlock'
import { getDaoUrl, LinkDao } from '../../context/PageContext'
import InviteFormDialog from './components/InviteFormDialog'

export default function People() {
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<MemberDto[]>()

  const [showInviteForm, setShowInviteForm] = useState(false)

  const { daoId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.search.indexOf('?invite') === -1) return
    setShowInviteForm(true)
  }, [location.search])

  useEffect(() => {
    if (members !== undefined) return
    if (failed) return
    if (loading) return
    setLoading(true)
    findMembers({ daoId })
      .then((m) => {
        setMembers(m)
      })
      .catch((err) => {
        setFailed(true)
        console.error(`Request failed: ${err.stack}`)
      })
      .finally(() => setLoading(false))
  }, [daoId, failed, loading, members])

  const onInviteFormClose = () => {
    setShowInviteForm(false)
    navigate(getDaoUrl(daoId, 'people'))
  }

  return (
    <ContentBlock title="People">
      <InviteFormDialog open={showInviteForm} onClose={onInviteFormClose} />
      {loading ? (
        <CircularProgress />
      ) : failed ? (
        <Box>
          Failed to load. <Button onClick={() => setFailed(false)}>Retry</Button>
        </Box>
      ) : (
        <Box>
          {members && members.length ? (
            members.map((member) => <p>{member.userId}</p>)
          ) : (
            <p>This DAO has no members yet.</p>
          )}
          <Box>
            <LinkDao path="people?invite">Invite a member</LinkDao>
          </Box>
        </Box>
      )}
    </ContentBlock>
  )
}
