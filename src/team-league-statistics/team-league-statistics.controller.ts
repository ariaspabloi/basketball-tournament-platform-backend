import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { TeamLeagueStatisticsService } from './team-league-statistics.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { CreateTeamLeagueStatisticDto } from './dto/create-team-league-statistic.dto';

@Controller('team-league-statistics')
export class TeamLeagueStatisticsController {
  constructor(
    private readonly teamLeagueStatisticsService: TeamLeagueStatisticsService,
  ) {}

  @Post()
  create(@Body() createTeamLeagueStatisticDto: CreateTeamLeagueStatisticDto) {
    return this.teamLeagueStatisticsService.create(
      createTeamLeagueStatisticDto,
    );
  }

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
