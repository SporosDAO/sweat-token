import {
  AuthApi,
  Configuration,
  DaoApi,
  DaoSettingsDto,
  JwtTokenDto,
  MemberApi,
  NoncePayloadDto,
  ProjectApi,
  SiwePayloadDto,
  TaskApi,
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
    // this.project = new ProjectApi(config, basePath)
    // this.task = new TaskApi(config, basePath)
    // this.member = new MemberApi(config, basePath)
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

export const getSettings = async (chainId: string, daoId: string): Promise<DaoSettingsDto> => {
  const res = await client.dao.daoSettingsControllerGetSettings(chainId, daoId)
  return res.data
}

export const setSettings = async (s: DaoSettingsDto): Promise<DaoSettingsDto> => {
  const res = await client.dao.daoSettingsControllerSetSettings(s.daoId, s.chainId, s)
  return res.data
}

export const verifySignature = async (sig: SiwePayloadDto): Promise<JwtTokenDto> => {
  const res = await client.auth.authControllerVerifySignature(sig)
  return res.data
}

export const getCurrentUser = async (): Promise<UserDto> => {
  const res = await client.auth.authControllerGetProfile()
  return res.data
}

export const getUserByAddress = async (chainId: number, publicAddress: string): Promise<NoncePayloadDto> => {
  const res = await client.auth.authControllerGetUser(`${chainId}`, publicAddress)
  return res.data
}
