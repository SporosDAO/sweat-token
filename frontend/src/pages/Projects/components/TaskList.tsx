import { CancelOutlined, Loop, TaskAlt } from '@mui/icons-material'
import {
  Avatar,
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
import { useCallback, useEffect, useState } from 'react'
import { deleteTask, findTasks } from '../../../api'
import { ProjectDto, TaskDto, TaskDtoTypeEnum } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useToast from '../../../context/ToastContext'
import { formatCurrency, formatDateFromNow } from '../../../util'
import TaskAddDialog from './TaskAddDialog'
import TaskAssignDialog from './TaskAssignDialog'

interface TaskListProps {
  project: ProjectDto
  onChange: () => void
}

export default function TaskList({ onChange, project }: TaskListProps) {
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [selection, setSelection] = useState<Record<string, boolean>>()

  const [tasks, setTasks] = useState<TaskDto[]>()
  const { showToast } = useToast()

  const [selectedTask, setSelectedTask] = useState<TaskDto>()
  const [showAssignTask, setShowAssignTask] = useState(false)

  useEffect(() => {
    if (selection !== undefined) return
    if (!tasks) return
    setSelection(tasks.reduce((o, t) => ({ ...o, [t.taskId]: false }), {}))
  }, [selection, tasks])

  useEffect(() => {
    if (tasks !== undefined) return
    if (failed) return
    if (loading) return
    setLoading(true)
    findTasks({ daoId: project.daoId, projectId: project.projectId })
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
    onChange()
  }

  const removeTask = (task: TaskDto) => {
    if (!task || !task.taskId) return
    if (!window.confirm(`Remove selected task? `)) return
    deleteTask(task.daoId, task.taskId)
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

  const renderBudget = (task: TaskDto) => {
    if (!task.budget) return 'No budget'
    const value = formatCurrency(task.budget)
    if (task.type === TaskDtoTypeEnum.Onetime) return value
    let bands = ''
    if (task.bands) {
      const band = (b: number): string => formatCurrency(Math.round((task.budget / 10) * b))
      bands = `${band(task.bands[0])}-${band(task.bands[1])}`
    }
    return bands ? `${bands} (${value} max)` : `${value} max`
  }

  const toggleSelection = useCallback(
    (e: any) => {
      if (!selection) return
      setSelection(Object.keys(selection).reduce((o, k) => ({ ...o, [k]: e.target.checked }), selection))
    },
    [selection]
  )

  const onShowAssignTask = (task: TaskDto) => {
    console.log('assign', task)
    setSelectedTask(task)
    setShowAssignTask(true)
  }

  const onAssignedTask = () => {
    setSelectedTask(undefined)
    setShowAssignTask(false)
  }

  return (
    <ContentBlock title="Tasks">
      <TaskAddDialog project={project} onClose={() => onAddTaskClose()} open={showAddTask} />
      <TaskAssignDialog task={selectedTask} onClose={() => onAssignedTask()} open={showAssignTask} />
      <Box sx={{ textAlign: 'right' }} mb={1}>
        <Button variant="contained" onClick={(e) => setShowAddTask(true)} aria-label="add">
          Add a task
        </Button>
      </Box>

      {failed ? (
        <div style={{ textAlign: 'center' }}>
          <p>Failed to load list. </p>
          <Button variant="outlined" color="secondary" onClick={() => setFailed(false)} aria-label="retry">
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
                  <Checkbox onClick={toggleSelection} />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tasks || []).map((task) => (
                <TableRow key={task.taskId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ width: '1%' }}>
                    <Checkbox
                      checked={selection && selection[task.taskId] ? selection[task.taskId] : false}
                      onClick={() =>
                        setSelection((selection) => ({ ...selection, [task.taskId]: !(selection || {})[task.taskId] }))
                      }
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {task.name}
                  </TableCell>
                  <TableCell>{formatDateFromNow(task.deadline || project.deadline)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" flexWrap="wrap">
                      {task.type === TaskDtoTypeEnum.Onetime ? <TaskAlt /> : <Loop />}
                      &nbsp;&nbsp;
                      {renderBudget(task)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {task.contributorId ? (
                      <Avatar>{task.contributorId.substring(0, 2)}</Avatar>
                    ) : (
                      <a
                        href={`?assign=${task.taskId}`}
                        onClick={(e) => {
                          e.preventDefault()
                          onShowAssignTask(task)
                        }}
                      >
                        Not assigned
                      </a>
                    )}
                  </TableCell>
                  <TableCell align="center" sx={{ width: '1%' }}>
                    <Button color="error" onClick={() => removeTask(task)} aria-label="remove">
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
