import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LeaguesService } from 'src/leagues/leagues.service';
import { TeamLeagueStatisticsService } from 'src/team-league-statistics/team-league-statistics.service';
import { TeamsService } from 'src/teams/teams.service';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly teamService: TeamsService,
    private readonly leagueService: LeaguesService,
    private readonly teamLeagueStatisticsService: TeamLeagueStatisticsService,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    //TODO: check home away exists on the league
    const { homeId, awayId, leagueId, ...matchDetails } = createMatchDto;
    const league = await this.leagueService.findOne(leagueId);
    const home = await this.teamService.findOne(homeId);
    const away = await this.teamService.findOne(awayId);
    const match = await this.matchRepository.create({
      home,
      away,
      league,
      ...matchDetails,
    });
    await this.matchRepository.save(match);
    return match;
  }

  async findAll() {
    const teams = await this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.league', 'league')
      .leftJoinAndSelect('match.away', 'awayTeam')
      .leftJoinAndSelect('match.home', 'homeTeam')
      .leftJoinAndSelect('homeTeam.club', 'homeClub')
      .leftJoinAndSelect('awayTeam.club', 'awayClub')
      .select([
        'match',
        'league',
        'awayTeam',
        'homeTeam',
        'homeClub.name',
        'awayClub.name',
        'homeClub.image',
        'awayClub.image',
      ])
      .getMany();

    return teams;
  }

  async findOne(id: number) {
    const match = await this.matchRepository
      .createQueryBuilder('match')
      .where('match.id = :id', { id })
      .leftJoinAndSelect('match.away', 'awayTeam')
      .leftJoinAndSelect('match.home', 'homeTeam')
      .leftJoinAndSelect('homeTeam.club', 'homeClub')
      .leftJoinAndSelect('awayTeam.club', 'awayClub')
      .select([
        'match',
        'awayTeam',
        'homeTeam',
        'homeClub.name',
        'awayClub.name',
      ])
      .getOne();
    if (!match)
      throw new NotFoundException(`Equipo con id ${id} no encontrado.`);
    return match;
  }

  async findOneLeague(id: number) {
    const match = await this.matchRepository
      .createQueryBuilder('match')
      .where('match.id = :id', { id })
      .leftJoin('match.league', 'league')
      .leftJoin('match.away', 'awayTeam')
      .leftJoin('match.home', 'homeTeam')
      .select([
        'match.id',
        'awayTeam.id',
        'homeTeam.id',
        'league.id',
        'league.name',
      ])
      .getOne();
    if (!match)
      throw new NotFoundException(`Partido con id ${id} no encontrado.`);
    return match;
  }

  async getCount() {
    const count = await this.matchRepository
      .createQueryBuilder('match')
      .getCount();
    return count;
  }

  async findLeagueMatches(leagueId) {
    const matches = await this.matchRepository
      .createQueryBuilder('match')
      .innerJoinAndSelect('match.league', 'league', 'league.id = :id', {
        id: leagueId,
      })
      .innerJoinAndSelect('match.home', 'homeTeam')
      .innerJoinAndSelect('homeTeam.club', 'homeClub')
      .innerJoinAndSelect('match.away', 'awayTeam')
      .innerJoinAndSelect('awayTeam.club', 'awayClub')
      .select([
        'league.id',
        'match',
        'awayTeam.id',
        'awayClub.id',
        'awayClub.image',
        'awayClub.name',
        'homeTeam.id',
        'homeClub.id',
        'homeClub.image',
        'homeClub.name',
      ])
      .getMany();

    return matches;
  }

  async findAllByTeam(teamId: number) {
    const team = await this.teamService.findOne(teamId);
    const matches = await this.matchRepository.find({
      where: [{ home: team }, { away: team }],
      relations: { away: true, home: true },
    });
    console.log(matches);
    return matches;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    const oldMatch = await this.matchRepository.findOne({
      where: { id },
      relations: ['league', 'home', 'away'],
    });

    const match = await this.matchRepository.preload({
      id: +id,
      ...updateMatchDto,
    });
    if (!match)
      throw new NotFoundException(`Partido con id ${id} no encontrado.`);
    await this.matchRepository.save(match);
    const newMatch = await this.matchRepository.findOne({
      where: { id },
      relations: ['league', 'home', 'away'],
    });
    await this.teamLeagueStatisticsService.updateFromMatches(
      oldMatch,
      newMatch,
    );
    return newMatch;
  }

  async remove(id: number) {
    const match = await this.findOne(id);
    await this.matchRepository.remove(match);
  }
}
