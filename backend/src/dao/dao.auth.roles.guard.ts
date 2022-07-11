import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import axios from 'axios'
import { MemberService } from 'src/member/member.service'
import { UserDto } from 'src/user/user.dto'
import { DaoService } from './dao.service'

@Injectable()
export class DaoRolesGuard implements CanActivate {
  constructor(private daoService: DaoService, private memberService: MemberService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { params } = req
    const user = req.user as UserDto

    if (!user) return false

    const res = await this.getPeople(params.chainId, params.daoId)
    if (!res) return false

    const { people, tokenTotalSupply } = res

    const stakes = people
      .filter((p) => p.address !== user.publicAddress)
      .map(({ shares }) => (100 * +shares) / tokenTotalSupply)

    if (!stakes.length) return false

    const isAdmin = stakes[0] > +process.env.SHARES_ADMIN
    return isAdmin
  }

  async getPeople(
    chainId,
    address,
  ): Promise<{ people: { address: string; shares: string }[]; tokenTotalSupply: number }> {
    try {
      const res = await axios.post(process.env.GRAPH_URL[chainId], {
        query: `query {
            daos(where: {
              id: "${address.toLowerCase()}"
            }) {
                id
                members {
                    address
                    shares
                  }
                  token {
                    totalSupply
                  }
            }
          }`,
      })
      const tokenTotalSupply = res.data.data.daos[0]['token']['totalSupply']
      const people = res.data.data.daos[0]['members']
      return { people, tokenTotalSupply }
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
