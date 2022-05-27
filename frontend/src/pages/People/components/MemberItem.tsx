import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Menu, MenuItem, Stack } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import * as React from 'react'
import { updateMember } from '../../../api'
import { ExtendedMemberDto } from '../../../api/openapi'
import useToast from '../../../context/ToastContext'

interface MemberItemProps {
  member: ExtendedMemberDto
  onUpdate: () => void
}

export default function MemberItem(props: MemberItemProps) {
  const member = props.member

  const { showToast } = useToast()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const cancelInvite = () => {
    handleClose()
    updateMember({ ...member, status: 'cancelled' })
      .then(() => {
        props.onUpdate()
      })
      .catch((e) => {
        showToast(`Request failed`, 'error')
        console.error(`Update failed: ${e.stack}`)
      })
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={cancelInvite}>Cancel invitation</MenuItem>
      </Menu>
      <CardHeader
        avatar={
          <Avatar aria-label="member">
            {member.name ? member.name.substring(0, 1).toUpperCase() : member.publicAddress.substring(0, 2)}
          </Avatar>
        }
        action={
          <IconButton
            aria-label="settings"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
        }
        title={member.name || 'No name'}
        subheader={member.publicAddress.substring(0, 6) + '..'}
      />
      {/* <CardMedia component="img" height="194" image="/static/images/cards/paella.jpg" alt="Paella dish" /> */}
      <CardContent>
        <Stack direction="row" spacing={1}>
          {(member.roles || []).map((role) => (
            <Chip label={role} color={role === 'founder' ? 'success' : 'primary'} variant="outlined" />
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Chip label={member.status} variant="outlined" />
        </Stack>
      </CardContent>
      {/* <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions> */}
    </Card>
  )
}
