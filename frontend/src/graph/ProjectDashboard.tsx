import { Stack, Button, CircularProgress, Grid, List, ListItem, useMediaQuery, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { findProjects } from '../../../api'
import { ProjectDto } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useDao from '../../../context/DaoContext'
import { LinkProject } from '../../../context/PageContext'
import { formatCurrency, formatDateFromNow } from '../../../util'

const useStyles = makeStyles((theme) => ({
  root: {},
  each_project: {
    display: 'block',
    border: `1px solid #000000`,
    padding: '20px',
    margin: '10px'
  },
  project_title: {
    fontSize: '18px',
    borderBottom: '1px solid #000000'
  },
  project_item: {
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: '22px',
    marginBottom: '10px'
  }
}))

const ProjectsList = () => {
  const [projects, setProjects] = useState<ProjectDto[]>()
  const [loading, setLoading] = useState<boolean>(false)
  const [failed, setFailed] = useState<boolean>(false)
  const { daoId } = useDao()

  const theme = useTheme()
  const classes = useStyles()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    if (!daoId) return
    if (projects !== undefined) return
    if (failed) return
    if (loading) return
    setLoading(true)
    findProjects({ daoId })
      .then((projects: ProjectDto[]) => {
        setProjects(projects)
      })
      .catch((e) => {
        setFailed(true)
        console.error(`Request failed: ${e.stack}`)
      })
      .finally(() => setLoading(false))
  }, [daoId, failed, loading, projects])
  // console.log("projects are:", projects)

  return (
    <Box>
      {failed ? (
        <p>
          Failed to load.{' '}
          <Button onClick={() => setFailed(false)} aria-label="retry">
            Retry
          </Button>
        </p>
      ) : loading ? (
        <CircularProgress />
      ) : projects && projects.length ? (
        <>
          {/* <List>
            {(projects || []).map((project) => (
              <ListItem key={project.projectId}>
                <Stack direction="row" spacing={1}>
                  <LinkProject project={project}>{project.name}</LinkProject>
                  <div>deadline in {formatDateFromNow(project.deadline)},</div>
                  <div>budget {formatCurrency(project.budget)}</div>
                </Stack>
              </ListItem>
            ))}
          </List> */}
          <Grid container sx={{ flexGrow: 1 }}>
            {(projects || []).map((project) => (
              <Grid key={project.projectId} item xs={12} md={6} lg={4}>
                <Box className={classes.each_project}>
                  <div className={classes.project_title} style={{ marginBottom: '20px' }}>
                    <LinkProject project={project}>{project.name}</LinkProject>
                  </div>
                  <div className={classes.project_item}>Project Manager: </div>
                  <div className={classes.project_item}>Budget: {formatCurrency(project.budget)}</div>
                  <div className={classes.project_item}>Deadline: {formatDateFromNow(project.deadline)}</div>
                  <div className={classes.project_item}>
                    <div className={classes.project_item}>Key Goals:</div>
                    <div className={classes.project_item} style={{ fontSize: '16px', marginLeft: '20px' }}>
                      1. Retain attorney
                    </div>
                    <div className={classes.project_item} style={{ fontSize: '16px', marginLeft: '20px' }}>
                      2. Deliver LLC OA draft
                    </div>
                  </div>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Box>No projects yet. </Box>
      )}

      <Box textAlign="right">
        <LinkProject add daoId={daoId}>
          Create new project
        </LinkProject>
      </Box>
    </Box>
  )
}

export default function ProjectDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={12}>
        <ContentBlock title="Active Projects">
          <ProjectsList />
        </ContentBlock>
      </Grid>
      <Grid item xs={12} lg={12}>
        <ContentBlock title="Tasks">
          <p>Coming soon..</p>
        </ContentBlock>
      </Grid>
    </Grid>
  )
}
