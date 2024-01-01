import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaguesService } from 'src/leagues/leagues.service';
import { Match } from 'src/matches/entities/match.entity';
import { TeamsService } from 'src/teams/teams.service';
import { Repository } from 'typeorm';
import { CreateTeamLeagueStatisticDto } from './dto/create-team-league-statistic.dto';
import { TeamLeagueStatistic } from './entities/team-league-statistic.entity';

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
    homeTeamStatistic.points += 2;
    homeTeamStatistic.pointsAgainst += awayPoints;
    homeTeamStatistic.favorablePoints += homePoints;
    homeTeamStatistic.matchesWon += homePoints > awayPoints ? 1 : 0;
    homeTeamStatistic.matchesLost += homePoints < awayPoints ? 1 : 0;

    // Update away team statistic
    awayTeamStatistic.points += 2;
    awayTeamStatistic.pointsAgainst += homePoints;
    awayTeamStatistic.favorablePoints += awayPoints;
    awayTeamStatistic.matchesWon += awayPoints > homePoints ? 1 : 0;
    awayTeamStatistic.matchesLost += awayPoints < homePoints ? 1 : 0;

    // Save updated statistics
    await this.teamLeagueRepository.save(homeTeamStatistic);
    await this.teamLeagueRepository.save(awayTeamStatistic);

    return { homeTeamStatistic, awayTeamStatistic };
  }

  async updateFromMatches(oldMatch: Match, newMatch: Match) {
    const home = await this.teamLeagueRepository.findOne({
      where: { league: oldMatch.league, team: oldMatch.home },
    });
    const away = await this.teamLeagueRepository.findOne({
      where: { league: oldMatch.league, team: oldMatch.away },
    });
    if (!(oldMatch.awayPoints === 0 && oldMatch.homePoints === 0)) {
      home.favorablePoints = home.favorablePoints - oldMatch.homePoints;
      home.pointsAgainst = home.pointsAgainst - oldMatch.awayPoints;

      away.favorablePoints = away.favorablePoints - oldMatch.awayPoints;
      away.pointsAgainst = away.pointsAgainst - oldMatch.homePoints;
      if (oldMatch.homePoints > oldMatch.awayPoints) {
        home.points = home.points - 2;
        home.matchesWon = home.matchesWon - 1;
        away.matchesLost = away.matchesLost - 1;
      } else {
        away.points = away.points - 2;
        away.matchesWon = away.matchesWon - 1;
        home.matchesLost = home.matchesLost - 1;
      }
    }

    home.favorablePoints = home.favorablePoints + newMatch.homePoints;
    home.pointsAgainst = home.pointsAgainst + newMatch.awayPoints;

    away.favorablePoints = away.favorablePoints + newMatch.awayPoints;
    away.pointsAgainst = away.pointsAgainst + newMatch.homePoints;
    if (newMatch.homePoints > newMatch.awayPoints) {
      home.points = home.points + 2;
      home.matchesWon = home.matchesWon + 1;
      away.matchesLost = away.matchesLost + 1;
    } else {
      away.points = away.points + 2;
      away.matchesWon = away.matchesWon + 1;
      home.matchesLost = home.matchesLost + 1;
    }
    await this.teamLeagueRepository.save(home);
    await this.teamLeagueRepository.save(away);
    return;
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
