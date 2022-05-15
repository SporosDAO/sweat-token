import { AuthApi, Configuration, DaoApi, DaoDto, JwtTokenDto, NonceDto, UserDto } from './openapi'

class ApiClient {
  public token: string | undefined = undefined

  public auth: AuthApi = new AuthApi()
  public dao: DaoApi = new DaoApi()

  constructor() {
    this.initClient()
  }

  public initClient(accessToken?: string) {
    this.token = accessToken
    const config = new Configuration({ accessToken })
    const basePath = `${window.location.protocol}//${window.location.host}`
    this.auth = new AuthApi(config, basePath)
    this.dao = new DaoApi(config, basePath)
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
  return res.data as JwtTokenDto
}
