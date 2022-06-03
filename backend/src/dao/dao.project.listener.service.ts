import * as moment from 'moment'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { TaskService } from 'src/task/task.service'
import { CommitmentType, TaskEvent } from '../task/task.dto'
import { ProjectService } from '../project/project.service'

@Injectable()
export class ProjectEventListenerService {
  constructor(private projectService: ProjectService, private taskService: TaskService) {}

  async updateAllocation(projectId: string): Promise<number> {
    const project = await this.projectService.read(projectId)
    const tasks = await this.taskService.find({ projectId })

    const budgetAllocation = tasks
      .map((task) => {
        if (task.type === CommitmentType.onetime) return task.budget || 0

        const maxBand = 10
        const highBand = task.bands && task.bands[1] ? task.bands[1] : maxBand

        const budgetMonth = (task.budget / maxBand) * highBand
        const workMonths = moment(project.deadline).diff(moment(task.created), 'months', true)
        const allocated = workMonths * budgetMonth
        return Math.round(allocated)
      })
      .reduce((sum, val) => sum + val, 0)

    project.budgetAllocation = budgetAllocation
    await this.projectService.update(project)

    return budgetAllocation
  }

  @OnEvent('task.changed')
  async onTaskEvent(payload: TaskEvent) {
    this.updateAllocation(payload.projectId)
  }
}
