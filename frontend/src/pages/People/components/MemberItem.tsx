import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip, Menu, MenuItem, Stack } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import * as React from 'react'
import { updateMember } from '../../../api'
import { ExtendedMemberDto, ExtendedMemberDtoStatusEnum, MemberDto } from '../../../api/openapi'
import useToast from '../../../context/ToastContext'
import useWeb3 from '../../../context/Web3Context'

interface MemberItemProps {
  member: ExtendedMemberDto
  onUpdate: () => void
  onEdit: (member: MemberDto) => void
}

export default function MemberItem(props: MemberItemProps) {
  const member = props.member

  const { showToast } = useToast()
  const { account } = useWeb3()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const isUser = account === member.publicAddress
  const isPending = member.status == 'pending'

  const updateInvite = React.useCallback(() => {
    handleClose()
    updateMember({ ...member, status: isPending ? 'cancelled' : 'pending' })
      .then(() => {
        props.onUpdate()
      })
      .catch((e) => {
        showToast(`Request failed`, 'error')
        console.error(`Update failed: ${e.stack}`)
      })
  }, [isPending, member, props, showToast])

  const renderRoleColor = (role: string) => {
    switch (role) {
      case 'founder':
        return 'success'
      case 'projectManager':
        return 'secondary'
      default:
        return 'primary'
    }
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
        <MenuItem onClick={updateInvite}>{isPending ? 'Cancel' : 'Renew'} invitation</MenuItem>
        <MenuItem onClick={() => props.onEdit(member)}>Edit</MenuItem>
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
        title={(isUser ? '(*) ' : '') + (member.name || 'No name')}
        subheader={member.publicAddress.substring(0, 6) + '..'}
      />
      {/* <CardMedia component="img" height="194" image="/static/images/cards/paella.jpg" alt="Paella dish" /> */}
      <CardContent>
        <Stack direction="row" spacing={1}>
          {(member.roles || []).map((role) => (
            <Chip key={role} label={role} color={renderRoleColor(role)} variant="outlined" />
          ))}
        </Stack>
        <Stack direction="row" mt={1} spacing={1}>
          <Chip
            label={member.status}
            color={member.status === ExtendedMemberDtoStatusEnum.Pending ? 'warning' : undefined}
            variant="outlined"
          />
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
