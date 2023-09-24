import { Controller, Get, Param } from '@nestjs/common';
import { TeamLeagueStatisticsService } from './team-league-statistics.service';

@Controller('team-league-statistics')
export class TeamLeagueStatisticsController {
  constructor(
    private readonly teamLeagueStatisticsService: TeamLeagueStatisticsService,
  ) {}

  @Get('league/:leagueId')
  findTeamLeagueStatistics(@Param('leagueId') leagueId: number) {
    return this.teamLeagueStatisticsService.findLeagueStatistics(+leagueId);
  }
}
