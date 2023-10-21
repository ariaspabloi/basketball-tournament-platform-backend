import { Controller, Body, Patch, Param, Get } from '@nestjs/common';
import { PlayerStatisticsService } from './player-statistics.service';
import { UpdatePlayerStatisticDto } from './dto/update-player-statistic.dto';

@Controller('player-statistics')
export class PlayerStatisticsController {
  constructor(
    private readonly playerStatisticsService: PlayerStatisticsService,
  ) {}

  @Get('player/:id')
  getPlayerStatistics(@Param('id') playerId: string) {
    return this.playerStatisticsService.findOneByPlayer(+playerId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlayerStatisticDto: UpdatePlayerStatisticDto,
  ) {
    return this.playerStatisticsService.update(+id, updatePlayerStatisticDto);
  }
}
