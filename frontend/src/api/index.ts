import { AuthApi, DaoApi, DaoDto, JwtTokenDto, UserDto } from './openapi'

class ApiClient {
  public auth: AuthApi = new AuthApi()
  public dao: DaoApi = new DaoApi()
}

const client = new ApiClient()

export const getDao = async (daoId: string): Promise<DaoDto> => {
  const res = await client.dao.daoControllerLoad(daoId)
  return res.data
}

export const getCurrentUser = async (): Promise<UserDto> => {
  const res = await client.auth.authControllerGetProfile()
  return res.data
}

export const logout = async (): Promise<void> => {
  //
}

export const login = async (user: UserDto): Promise<JwtTokenDto> => {
  const res = await client.auth.authControllerLogin(user)
  return res.data
}
