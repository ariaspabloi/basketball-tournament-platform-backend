import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamLeagueStatistic } from './entities/team-league-statistic.entity';
import { Repository } from 'typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { LeaguesService } from 'src/leagues/leagues.service';
import { CreateTeamLeagueStatisticDto } from './dto/create-team-league-statistic.dto';

@Injectable()
export class TeamLeagueStatisticsService {
  constructor(
    @InjectRepository(TeamLeagueStatistic)
    private readonly teamLeagueRepository: Repository<TeamLeagueStatistic>,
    private readonly teamService: TeamsService,
    private readonly leagueService: LeaguesService,
  ) {}

  async create(createTeamLeagueStatisticDto: CreateTeamLeagueStatisticDto) {
    const { teamId, leagueId } = createTeamLeagueStatisticDto;
    const league = await this.leagueService.findOne(leagueId);
    const team = await this.teamService.findOne(teamId);
    const teamLeagueStatistic = await this.teamLeagueRepository.create({
      league,
      team,
    });
    return teamLeagueStatistic;
  }

  async findLeagueStatistics(leagueId: number) {
    const leagueStatistics = await this.teamLeagueRepository
      .createQueryBuilder('team-league-statistics')
      .innerJoin('team-league-statistics.league', 'league')
      .innerJoinAndSelect('team-league-statistics.team', 'team')
      .innerJoinAndSelect('team.club', 'user')
      .where('league.id = :id', { id: leagueId })
      .select(['team-league-statistics', 'team.id', 'team.club', 'user.name'])
      .getMany();
    if (!leagueStatistics)
      throw new NotFoundException('Estadistica no encontrada.');
    return leagueStatistics;
  }

  async findClubLeagues(clubId: number) {
    const teams = (await this.teamService.findOwned(clubId)).map(
      (team) => team.id,
    );
    const statistics = await this.teamLeagueRepository
      .createQueryBuilder('team-league-statistics')
      .leftJoinAndSelect('team-league-statistics.league', 'league')
      .leftJoinAndSelect('team-league-statistics.team', 'team')
      .leftJoinAndSelect('league.winner', 'user')
      .where('team-league-statistics.teamId IN (:...teams)', { teams: teams })
      .select(['team-league-statistics', 'league', 'user.id', 'user.name'])
      .getMany();
    return statistics;
  }

  /*
      .select(['team-league-statistics', 'league', 'league.winnerId'])
      .select([
        'league.id',
        'match',
        'homeTeam',
        'awayTeam',
        'awayClub.name',
        'homeClub.name',
      ]) */
}
