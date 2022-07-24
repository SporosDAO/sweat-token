import { graphEndpoints } from '@app/runtime/graph-endpoints'
import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import axios from 'axios'
import { MemberService } from 'src/member/member.service'
import { UserDto } from 'src/user/user.dto'
import { DaoService } from './dao.service'

@Injectable()
export class DaoRolesGuard implements CanActivate {
  private readonly logger = new Logger(DaoRolesGuard.name)

  constructor(private daoService: DaoService, private memberService: MemberService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const { params } = req
    const user = req.user as UserDto

    if (!user) return false

    const res = await this.getPeople(params.chainId, params.daoId)
    if (!res) return false

    const { people, tokenTotalSupply } = res

    const userStake = people.filter((p) => p.address.toLowerCase() === user.publicAddress.toLowerCase())
    if (userStake.length === 0) return false

    const stakes = userStake.map(({ shares }) => (100 * +shares) / tokenTotalSupply)

    const isAdmin = stakes[0] > +process.env.SHARES_ADMIN
    return isAdmin
  }

  async getPeople(
    chainId,
    address,
  ): Promise<{ people: { address: string; shares: string }[]; tokenTotalSupply: number }> {
    try {
      const endpoint = graphEndpoints[chainId]
      if (!endpoint) {
        throw new InternalServerErrorException(`chainId=${chainId} has no graph URL`)
      }
      const res = await axios.post(endpoint, {
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
      this.logger.error(`getPeople failed: ${e.stack}`)
      return null
    }
  }
}
