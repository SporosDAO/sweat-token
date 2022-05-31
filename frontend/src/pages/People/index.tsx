import { Button, CircularProgress, Stack } from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { listMembers } from '../../api'
import { ExtendedMemberDto } from '../../api/openapi'
import ContentBlock from '../../components/ContentBlock'
import { getDaoUrl, LinkDao } from '../../context/PageContext'
import InviteFormDialog from './components/InviteFormDialog'
import MemberItem from './components/MemberItem'

export default function People() {
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<ExtendedMemberDto[]>()

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
    listMembers({ daoId })
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
    setMembers(undefined)
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
          <Box sx={{ mb: 3 }}>
            <LinkDao path="people?invite">Invite a member</LinkDao>
          </Box>
          <Stack direction="row" spacing={2}>
            {members && members.length ? (
              members.map((member) => (
                <MemberItem key={member.memberId} member={member} onUpdate={() => setMembers(undefined)} />
              ))
            ) : (
              <p>This DAO has no members yet.</p>
            )}
          </Stack>
        </Box>
      )}
    </ContentBlock>
  )
}
