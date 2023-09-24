import { Controller, Body, Patch, Param } from '@nestjs/common';
import { PlayerStatisticsService } from './player-statistics.service';
import { UpdatePlayerStatisticDto } from './dto/update-player-statistic.dto';

@Controller('player-statistics')
export class PlayerStatisticsController {
  constructor(
    private readonly playerStatisticsService: PlayerStatisticsService,
  ) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlayerStatisticDto: UpdatePlayerStatisticDto,
  ) {
    return this.playerStatisticsService.update(+id, updatePlayerStatisticDto);
  }
}
