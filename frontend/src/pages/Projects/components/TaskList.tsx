import { Button, CircularProgress, List, ListItem } from '@mui/material'
import { useEffect, useState } from 'react'
import { findTasks } from '../../../api'
import { ProjectDto, TaskDto } from '../../../api/openapi'
import ContentBlock from '../../../components/ContentBlock'
import useToast from '../../../context/ToastContext'
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

  return (
    <ContentBlock title="Tasks">
      <TaskAddDialog project={project} onClose={() => onAddTaskClose()} open={showAddTask} />
      {failed ? (
        <div style={{ textAlign: 'center' }}>
          <p>Failed to load list. </p>
          <Button variant="outlined" onClick={() => setFailed(false)}>
            Retry
          </Button>
        </div>
      ) : loading ? (
        <CircularProgress />
      ) : tasks && !tasks.length ? (
        <div style={{ textAlign: 'center' }}>
          <p>No tasks yet.</p>
          <Button variant="outlined" onClick={() => setShowAddTask(true)}>
            Add a task
          </Button>
        </div>
      ) : (
        <List>
          {(tasks || []).map((task) => (
            <ListItem key={task.taskId}>{task.name}</ListItem>
          ))}
        </List>
      )}
    </ContentBlock>
  )
}
