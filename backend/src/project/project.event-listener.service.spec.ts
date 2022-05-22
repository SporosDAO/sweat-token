import { RuntimeModule } from '@app/runtime'
import { Test, TestingModule } from '@nestjs/testing'
import * as moment from 'moment'
import { CommitmentType } from 'src/task/task.dto'
import { TaskModule } from 'src/task/task.module'
import { TaskService } from 'src/task/task.service'
import { ProjectEventListenerService } from './project.event-listener.service'
import { ProjectModule } from './project.module'
import { ProjectService } from './project.service'

describe('ProjectEventListenerService', () => {
  let module: TestingModule
  let projectEventListenerService: ProjectEventListenerService
  let projectService: ProjectService
  let taskService: TaskService

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [RuntimeModule, TaskModule, ProjectModule],
      providers: [ProjectEventListenerService],
    }).compile()

    projectEventListenerService = module.get(ProjectEventListenerService)
    projectService = module.get(ProjectService)
    taskService = module.get(TaskService)

    await module.init()
  })

  afterAll(async () => {
    await module.close()
  })

  beforeEach(async () => {
    await projectService.deleteAll()
    await taskService.deleteAll()
  })

  it('should calcultate project budget allocation', async () => {
    const p = await projectService.create({
      budget: 10 * 1000,
      ownerId: 'owner',
      daoId: 'test',
      deadline: moment().clone().add('6', 'months').toDate(),
      name: 'test',
    })

    // allocate 40%
    const t1 = await taskService.create({
      projectId: p.projectId,
      daoId: 'test',
      name: 'task',
      type: CommitmentType.onetime,
      budget: 4000,
      ownerId: 'owner',
    })

    // allocate 60% in 6 month
    const t2 = await taskService.create({
      projectId: p.projectId,
      daoId: 'test',
      name: 'task',
      type: CommitmentType.ongoing,
      bands: [1, 10],
      budget: 1000,
      ownerId: 'owner',
    })

    const budgetAllocation = await projectEventListenerService.updateAllocation(p.projectId)
    expect(budgetAllocation).toBe(p.budget)

    const p1 = await projectService.read(p.projectId)
    expect(p1.budgetAllocation).toBe(budgetAllocation)
  })
})
