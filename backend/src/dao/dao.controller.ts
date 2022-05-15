import { Controller, Get, Param } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { DaoDto } from './dao.dto'
import { DaoService } from './dao.service'

@Controller('dao')
@ApiTags('dao')
export class DaoController {
  constructor(private daoService: DaoService) {}

  @Get()
  @ApiOkResponse({ type: [DaoDto] })
  list(): Promise<DaoDto[]> {
    return this.daoService.list()
  }

  @Get(':daoId')
  @ApiOkResponse({ type: DaoDto })
  @ApiNotFoundResponse()
  load(@Param('daoId') daoId: string): Promise<DaoDto> {
    return this.daoService.load(daoId)
  }
}
