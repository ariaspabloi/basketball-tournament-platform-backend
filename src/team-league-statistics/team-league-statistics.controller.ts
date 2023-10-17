import { Controller, Get, Param, Req } from '@nestjs/common';
import { TeamLeagueStatisticsService } from './team-league-statistics.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('team-league-statistics')
export class TeamLeagueStatisticsController {
  constructor(
    private readonly teamLeagueStatisticsService: TeamLeagueStatisticsService,
  ) {}

  @Get('league/:leagueId')
  findTeamLeagueStatistics(@Param('leagueId') leagueId: number) {
    return this.teamLeagueStatisticsService.findLeagueStatistics(+leagueId);
  }

  @Roles(Role.Club)
  @Get('club')
  findClubLeagues(@Req() req: any) {
    return this.teamLeagueStatisticsService.findClubLeagues(req.user.sub);
  }
}
