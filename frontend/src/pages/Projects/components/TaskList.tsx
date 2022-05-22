import { CancelOutlined } from '@mui/icons-material'
import {
  Button,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { Box } from '@mui/system'
import { useEffect, useState } from 'react'
import { deleteTask, findTasks } from '../../../api'
import { ProjectDto, TaskDto } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useToast from '../../../context/ToastContext'
import { formatCurrency, formatDateFromNow } from '../../../util'
import TaskAddDialog from './TaskAddDialog'

interface TaskListProps {
  project: ProjectDto
}

export default function TaskList({ project }: TaskListProps) {
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState<TaskDto[]>()
  const { showToast } = useToast()

  useEffect(() => {
    if (tasks !== undefined) return
    if (failed) return
    if (loading) return
    setLoading(true)
    findTasks({ projectId: project.projectId })
      .then((tasks: TaskDto[]) => {
        setTasks(tasks)
      })
      .catch((e) => {
        showToast(`Failed to load task list`, 'error')
        setFailed(true)
        console.error(`Task list load error: ${e.stack}`)
      })
      .finally(() => setLoading(false))
  }, [failed, loading, project, showToast, tasks])

  const onAddTaskClose = () => {
    setShowAddTask(false)
    setTasks(undefined)
  }

  const removeTask = (task: TaskDto) => {
    if (!window.confirm(`Remove selected task? `)) return
    deleteTask(task.taskId)
      .then(() => {
        showToast(`Task deletion succeeded`, 'success')
      })
      .catch((e: any) => {
        showToast(`Task deletion failed`, 'error')
        console.error(`task ${task.taskId} deletion error: ${e.stack}`)
      })
      .finally(() => {
        setLoading(false)
        setTasks(undefined)
      })
  }

  return (
    <ContentBlock title="Tasks">
      <TaskAddDialog project={project} onClose={() => onAddTaskClose()} open={showAddTask} />

      <Box sx={{ textAlign: 'right' }} mb={1}>
        <Button variant="contained" onClick={() => setShowAddTask(true)}>
          Add a task
        </Button>
      </Box>

      {failed ? (
        <div style={{ textAlign: 'center' }}>
          <p>Failed to load list. </p>
          <Button variant="outlined" color="secondary" onClick={() => setFailed(false)}>
            Retry
          </Button>
        </div>
      ) : loading ? (
        <CircularProgress />
      ) : tasks && !tasks.length ? (
        <div style={{ textAlign: 'center' }}>
          <p>No tasks yet.</p>
        </div>
      ) : (
        <TableContainer component={Box}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#EFEFEF' }}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell align="right">Budget</TableCell>
                <TableCell align="right">Assignee</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tasks || []).map((task) => (
                <TableRow key={task.taskId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ width: '1%' }}>
                    <Checkbox />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {task.name}
                  </TableCell>
                  <TableCell component="th">{formatDateFromNow(task.deadline)}</TableCell>
                  <TableCell align="right">{formatCurrency(task.budget)}</TableCell>
                  <TableCell align="right">{task.contributorId || 'Not assigned'}</TableCell>
                  <TableCell align="center" sx={{ width: '1%' }}>
                    <Button color="error" onClick={() => removeTask(task)}>
                      <CancelOutlined />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </ContentBlock>
  )
}
