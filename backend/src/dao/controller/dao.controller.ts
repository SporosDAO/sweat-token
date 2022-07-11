import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/auth/auth.decorator'
import { User } from 'src/auth/user.decorator'
import { Role, UserDto } from 'src/user/user.dto'
import { DaoAuth } from '../dao.auth.decorator'
import { CreateDaoDto, DaoDto } from '../dao.dto'
import { DaoService } from '../dao.service'
import { DaoSettingsDto } from '../settings/dao.settings.dto'
import { DaoSettingsService } from '../settings/dao.settings.service'

@Controller('dao')
@ApiTags('dao')
export class DaoController {
  constructor(private daoService: DaoService, private daoSettingsService: DaoSettingsService) {}

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

  @Put(':chainId/:daoId/settings')
  @DaoAuth(Role.founder)
  setSettings(
    @Param('daoId') daoId: string,
    @Param('chainId') chainId: string,
    @Body() daoSettingsDto: DaoSettingsDto,
  ): Promise<DaoSettingsDto> {
    return this.daoSettingsService.setSettings({ ...daoSettingsDto, chainId, daoId })
  }

  @Get(':chainId/:daoId/settings')
  @DaoAuth(Role.founder)
  getSettings(@Param('chainId') chainId: string, @Param('daoId') daoId: string): Promise<DaoSettingsDto> {
    return this.daoSettingsService.getSettings(chainId, daoId)
  }
}
