import { Controller, Body, Patch, Param, Get, Res } from '@nestjs/common';
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

  @Patch('player/:playerId/match/:matchId')
  updatePlayerMatchStatistics(
    @Param('playerId') playerId: string,
    @Param('matchId') matchId: string,
    @Body() updatePlayerStatisticDto: UpdatePlayerStatisticDto,
  ) {
    return this.playerStatisticsService.createOrUpdatePlayerStatistic(
      +playerId,
      +matchId,
      updatePlayerStatisticDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlayerStatisticDto: UpdatePlayerStatisticDto,
  ) {
    return this.playerStatisticsService.update(+id, updatePlayerStatisticDto);
  }

  @Get('export/:teamId/:period')
  async exportPlayerStatistics(
    @Param('teamId') teamId: number,
    @Param('period') period: number,
    @Res() res: any,
  ) {
    const buffer =
      await this.playerStatisticsService.generatePlayerStatisticsExcel(
        teamId,
        period,
      );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=player-statistics.xlsx`,
    );
    res.end(buffer);
  }
}
