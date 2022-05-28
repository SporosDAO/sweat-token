import { Button, CircularProgress } from '@mui/material'
import { Box } from '@mui/system'
import { useState } from 'react'
import { MemberDto } from '../../api/openapi'
import ContentBlock from '../../components/ContentBlock'

export default function People() {
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<MemberDto[]>()

  return (
    <ContentBlock title="People">
      {loading ? (
        <CircularProgress />
      ) : failed ? (
        <Box>
          Failed to load. <Button onClick={() => setFailed(false)}>Retry</Button>
        </Box>
      ) : (
        <>coming soon</>
      )}
    </ContentBlock>
  )
}
