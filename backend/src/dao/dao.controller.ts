import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/auth.decorator'
import { Role } from 'src/user/user.dto'
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
  @Auth(Role.admin)
  delete(@Param('daoId') daoId: string): Promise<void> {
    return this.daoService.delete(daoId)
  }

  @Post()
  @Auth()
  create(@Body() daoDto: CreateDaoDto): Promise<DaoDto> {
    return this.daoService.create(daoDto)
  }

  @Put(':daoId')
  @Auth()
  update(@Param('daoId') daoId: string, @Body() daoDto: CreateDaoDto): Promise<DaoDto> {
    return this.daoService.update({ ...daoDto, daoId })
  }
}
