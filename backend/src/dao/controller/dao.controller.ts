import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/auth.decorator'
import { User } from 'src/auth/user.decorator'
import { Role, UserDto } from 'src/user/user.dto'
import { DaoAuth } from './dao.auth.decorator'
import { CreateDaoDto, DaoDto } from './dao.dto'
import { DaoService } from './dao.service'

@Controller('dao')
@ApiTags('dao')
export class DaoController {
  constructor(private daoService: DaoService) {}

  @Get()
  list(): Promise<DaoDto[]> {
    return this.daoService.list()
  }

  @Get(':daoId')
  read(@Param('daoId') daoId: string): Promise<DaoDto> {
    return this.daoService.read(daoId)
  }

  @Delete(':daoId')
  @DaoAuth(Role.founder)
  delete(@Param('daoId') daoId: string): Promise<void> {
    return this.daoService.delete(daoId)
  }

  @Post()
  @Auth()
  create(@User() user: UserDto, @Body() daoDto: CreateDaoDto): Promise<DaoDto> {
    daoDto.createdBy = user.userId
    return this.daoService.create(daoDto)
  }

  @Put(':daoId')
  @DaoAuth(Role.founder)
  update(@Param('daoId') daoId: string, @Body() daoDto: CreateDaoDto): Promise<DaoDto> {
    return this.daoService.update({ ...daoDto, daoId })
  }
}
