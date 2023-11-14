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
    await this.teamLeagueRepository.save(teamLeagueStatistic);
    return teamLeagueStatistic;
  }

  async findLeagueStatistics(leagueId: number) {
    const leagueStatistics = await this.teamLeagueRepository
      .createQueryBuilder('team-league-statistics')
      .innerJoin('team-league-statistics.league', 'league')
      .innerJoinAndSelect('team-league-statistics.team', 'team')
      .innerJoinAndSelect('team.club', 'user')
      .where('league.id = :id', { id: leagueId })
      .select([
        'team-league-statistics',
        'team.id',
        'team.club',
        'user.name',
        'user.image',
      ])
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
      .select([
        'team-league-statistics',
        'team',
        'league',
        'user.id',
        'user.name',
        'user.image',
      ])
      .getMany();
    return statistics;
  }

  async updateTeamStatistics(
    homeId: number,
    awayId: number,
    awayPoints: number,
    homePoints: number,
    leagueId: number,
  ) {
    // Find home team statistic
    const homeTeamStatistic = await this.teamLeagueRepository.findOne({
      where: {
        team: { id: homeId },
        league: { id: leagueId },
      },
    });

    // Find away team statistic
    const awayTeamStatistic = await this.teamLeagueRepository.findOne({
      where: {
        team: { id: awayId },
        league: { id: leagueId },
      },
    });

    if (!homeTeamStatistic || !awayTeamStatistic) {
      throw new NotFoundException('Team statistics not found.');
    }

    // Update home team statistic
    homeTeamStatistic.points += homePoints;
    homeTeamStatistic.pointsAgainst += awayPoints;
    homeTeamStatistic.favorablePoints += homePoints;
    homeTeamStatistic.matchesWon += homePoints > awayPoints ? 1 : 0;
    homeTeamStatistic.matchesLost += homePoints < awayPoints ? 1 : 0;

    // Update away team statistic
    awayTeamStatistic.points += awayPoints;
    awayTeamStatistic.pointsAgainst += homePoints;
    awayTeamStatistic.favorablePoints += awayPoints;
    awayTeamStatistic.matchesWon += awayPoints > homePoints ? 1 : 0;
    awayTeamStatistic.matchesLost += awayPoints < homePoints ? 1 : 0;

    // Save updated statistics
    await this.teamLeagueRepository.save(homeTeamStatistic);
    await this.teamLeagueRepository.save(awayTeamStatistic);

    return { homeTeamStatistic, awayTeamStatistic };
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
