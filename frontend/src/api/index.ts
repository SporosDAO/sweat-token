import {
  AuthApi,
  Configuration,
  CreateDaoDto,
  CreateMemberDto,
  CreateProjectDto,
  CreateTaskDto,
  DaoApi,
  DaoDto,
  DaoSettingsDto,
  ExtendedMemberDto,
  JwtTokenDto,
  MemberApi,
  MemberDto,
  MemberInviteDto,
  MemberQueryDto,
  NonceDto,
  ProjectApi,
  ProjectDto,
  ProjectQueryDto,
  TaskApi,
  TaskDto,
  TaskQueryDto,
  UserDto
} from './openapi'

let basePath = process.env.REACT_APP_SWEAT_TOKEN_API_BASEPATH

console.debug(`process.env.NODE_ENV=${process.env.NODE_ENV}`)
console.debug(`process.env.REACT_APP_SWEAT_TOKEN_API_BASEPATH=${process.env.REACT_APP_SWEAT_TOKEN_API_BASEPATH}`)

if (!basePath) {
  basePath = `${window.location.protocol}//${window.location.host}`
}
console.debug(`basePath=${basePath}`)

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
    // Enable credentials for prod and gitpod access
    const baseOptions = {
      headers: {
        Authorization: 'Bearer ' + accessToken
      },
      withCredentials: true
    }
    const config = new Configuration({
      accessToken,
      baseOptions
    })
    this.auth = new AuthApi(config, basePath)
    this.dao = new DaoApi(config, basePath)
    this.project = new ProjectApi(config, basePath)
    this.task = new TaskApi(config, basePath)
    this.member = new MemberApi(config, basePath)
  }
}

const client = new ApiClient()

export const setToken = (token: string | undefined) => {
  console.log(`Set API token`)
  client.initClient(token)
}

export const getToken = (): string | undefined => {
  return client.token
}

export const getDao = async (daoId: string): Promise<DaoDto> => {
  const res = await client.dao.daoControllerRead(daoId)
  return res.data
}

export const listDaos = async (): Promise<DaoDto[]> => {
  const res = await client.dao.daoControllerList()
  return res.data
}

export const createDao = async (p: CreateDaoDto): Promise<DaoDto> => {
  const res = await client.dao.daoControllerCreate(p)
  return res.data
}

export const updateDao = async (p: DaoDto): Promise<DaoDto> => {
  const res = await client.dao.daoControllerUpdate(p.daoId, p)
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
  if (!query.daoId) throw new Error('daoId is required')
  const res = await client.project.projectControllerFind(query.daoId, query)
  return res.data
}

export const loadProject = async (daoId: string, projectId: string): Promise<ProjectDto> => {
  const res = await client.project.projectControllerRead(daoId, projectId)
  return res.data
}

export const createProject = async (p: CreateProjectDto): Promise<ProjectDto> => {
  const res = await client.project.projectControllerCreate(p.daoId, p)
  return res.data
}

export const findTasks = async (query: TaskQueryDto): Promise<TaskDto[]> => {
  if (!query.daoId) throw new Error('daoId is required')
  const res = await client.task.taskControllerFind(query.daoId, query)
  return res.data
}

export const loadTask = async (daoId: string, taskId: string): Promise<TaskDto> => {
  const res = await client.task.taskControllerRead(daoId, taskId)
  return res.data
}

export const createTask = async (p: CreateTaskDto): Promise<TaskDto> => {
  const res = await client.task.taskControllerCreate(p.daoId, p)
  return res.data
}

export const updateTask = async (p: TaskDto): Promise<TaskDto> => {
  const res = await client.task.taskControllerUpdate(p.daoId, p.taskId, p)
  return res.data
}

export const deleteTask = async (daoId: string, taskId: string): Promise<void> => {
  await client.task.taskControllerDelete(daoId, taskId)
}

export const listMembers = async (query: MemberQueryDto): Promise<ExtendedMemberDto[]> => {
  if (!query.daoId) throw new Error(`daoId is required`)
  const res = await client.member.memberControllerList(query.daoId, query)
  return res.data
}

export const loadMember = async (daoId: string, memberId: string): Promise<MemberDto> => {
  const res = await client.member.memberControllerRead(daoId, memberId)
  return res.data
}

export const createMember = async (p: CreateMemberDto): Promise<MemberDto> => {
  const res = await client.member.memberControllerCreate(p.daoId, p)
  return res.data
}

export const updateMember = async (p: MemberDto): Promise<MemberDto> => {
  const res = await client.member.memberControllerUpdate(p.daoId, p.memberId, p)
  return res.data
}

export const deleteMember = async (daoId: string, memberId: string): Promise<void> => {
  await client.member.memberControllerDelete(daoId, memberId)
}

export const inviteMember = async (data: MemberInviteDto): Promise<MemberDto> => {
  const res = await client.member.memberControllerInvite(data.daoId, data)
  return res.data
}

export const getSettings = async (chainId: string, daoId: string): Promise<DaoSettingsDto> => {
  const res = await client.dao.daoSettingsControllerGetSettings(chainId, daoId)
  return res.data
}

export const setSettings = async (s: DaoSettingsDto): Promise<DaoSettingsDto> => {
  const res = await client.dao.daoSettingsControllerSetSettings(s.daoId, s.chainId, s)
  return res.data
}
