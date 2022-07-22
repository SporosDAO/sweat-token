import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Role } from 'src/user/user.dto'
import { DaoAuth } from '../dao.auth.decorator'
import { DaoSettingsDto } from './dao.settings.dto'
import { DaoSettingsService } from './dao.settings.service'

@Controller('dao/settings')
@ApiTags('dao')
export class DaoSettingsController {
  constructor(private daoSettingsService: DaoSettingsService) {}

  @Put(':chainId/:daoId')
  @DaoAuth(Role.founder)
  setSettings(
    @Param('daoId') daoId: string,
    @Param('chainId') chainId: string,
    @Body() daoSettingsDto: DaoSettingsDto,
  ): Promise<DaoSettingsDto> {
    return this.daoSettingsService.setSettings({ ...daoSettingsDto, chainId, daoId })
  }

  @Get(':chainId/:daoId')
  @DaoAuth(Role.founder)
  getSettings(@Param('chainId') chainId: string, @Param('daoId') daoId: string): Promise<DaoSettingsDto> {
    return this.daoSettingsService.getSettings(chainId, daoId)
  }
}
