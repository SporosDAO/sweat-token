import {
  AuthApi,
  Configuration,
  CreateProjectDto,
  CreateTaskDto,
  DaoApi,
  DaoDto,
  JwtTokenDto,
  NonceDto,
  ProjectApi,
  ProjectDto,
  ProjectQueryDto,
  TaskApi,
  TaskDto,
  TaskQueryDto,
  UserDto,
  MemberApi,
  CreateMemberDto,
  MemberDto,
  MemberQueryDto
} from './openapi'

const basePath = `${window.location.protocol}//${window.location.host}`

class ApiClient {
  public token: string | undefined = undefined

  public auth: AuthApi = new AuthApi(undefined, basePath)
  public dao: DaoApi = new DaoApi(undefined, basePath)
  public project: ProjectApi = new ProjectApi(undefined, basePath)
  public task: TaskApi = new TaskApi(undefined, basePath)
  public member: MemberApi = new MemberApi(undefined, basePath)

  constructor() {
    this.initClient()
  }

  public initClient(accessToken?: string) {
    this.token = accessToken
    const config = new Configuration({ accessToken })
    this.auth = new AuthApi(config, basePath)
    this.dao = new DaoApi(config, basePath)
    this.project = new ProjectApi(config, basePath)
    this.task = new TaskApi(config, basePath)
    this.member = new MemberApi(config, basePath)
  }
}

const client = new ApiClient()

export const setToken = (token: string | undefined) => {
  client.initClient(token)
}

export const getToken = (): string | undefined => {
  return client.token
}

export const getDao = async (daoId: string): Promise<DaoDto> => {
  const res = await client.dao.daoControllerLoad(daoId)
  return res.data
}

export const listDaos = async (): Promise<DaoDto[]> => {
  const res = await client.dao.daoControllerList()
  return res.data
}

export const getCurrentUser = async (): Promise<UserDto> => {
  const res = await client.auth.authControllerGetProfile()
  return res.data
}

export const getUserByAddress = async (publicAddress: string): Promise<NonceDto> => {
  const res = await client.auth.authControllerGetUser(publicAddress)
  return res.data
}

export const verifySignature = async (sig: NonceDto): Promise<JwtTokenDto> => {
  const res = await client.auth.authControllerVerifySignature(sig)
  return res.data
}

export const findProjects = async (query: ProjectQueryDto): Promise<ProjectDto[]> => {
  const res = await client.project.projectControllerFind(query)
  return res.data
}

export const loadProject = async (projectId: string): Promise<ProjectDto> => {
  const res = await client.project.projectControllerRead(projectId)
  return res.data
}

export const createProject = async (p: CreateProjectDto): Promise<ProjectDto> => {
  const res = await client.project.projectControllerCreate(p)
  return res.data
}

export const findTasks = async (query: TaskQueryDto): Promise<TaskDto[]> => {
  const res = await client.task.taskControllerFind(query)
  return res.data
}

export const loadTask = async (taskId: string): Promise<TaskDto> => {
  const res = await client.task.taskControllerRead(taskId)
  return res.data
}

export const createTask = async (p: CreateTaskDto): Promise<TaskDto> => {
  const res = await client.task.taskControllerCreate(p)
  return res.data
}

export const deleteTask = async (taskId: string): Promise<void> => {
  await client.task.taskControllerDelete(taskId)
}

export const findMembers = async (query: MemberQueryDto): Promise<MemberDto[]> => {
  const res = await client.member.memberControllerFind(query)
  return res.data
}

export const loadMember = async (memberId: string): Promise<MemberDto> => {
  const res = await client.member.memberControllerRead(memberId)
  return res.data
}

export const createMember = async (p: CreateMemberDto): Promise<MemberDto> => {
  const res = await client.member.memberControllerCreate(p)
  return res.data
}

export const deleteMember = async (memberId: string): Promise<void> => {
  await client.member.memberControllerDelete(memberId)
}
