import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const Dao = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const dao = request.dao

  return data ? dao?.[data] : dao
})

export const Member = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const member = request.member

  return data ? member?.[data] : member
})
