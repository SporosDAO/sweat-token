import {
  ProjectApi,
  AuthApi,
  Configuration,
  DaoApi,
  DaoDto,
  JwtTokenDto,
  NonceDto,
  UserDto,
  ProjectQueryDto,
  ProjectDto
} from './openapi'

const basePath = `${window.location.protocol}//${window.location.host}`

class ApiClient {
  public token: string | undefined = undefined

  public auth: AuthApi = new AuthApi(undefined, basePath)
  public dao: DaoApi = new DaoApi(undefined, basePath)
  public project: ProjectApi = new ProjectApi(undefined, basePath)

  constructor() {
    this.initClient()
  }

  public initClient(accessToken?: string) {
    this.token = accessToken
    const config = new Configuration({ accessToken })
    this.auth = new AuthApi(config, basePath)
    this.dao = new DaoApi(config, basePath)
    this.project = new ProjectApi(config, basePath)
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

export const createProject = async (p: ProjectDto): Promise<ProjectDto> => {
  const res = await client.project.projectControllerCreate(p)
  return res.data
}
