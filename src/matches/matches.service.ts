import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { LeaguesService } from 'src/leagues/leagues.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly teamService: TeamsService,
    private readonly leagueService: LeaguesService,
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

  async getCount() {
    const count = await this.matchRepository
      .createQueryBuilder('match')
      .getCount();
    return count;
  }

  async findAllByTeam(teamId: number) {
    const team = await this.teamService.findOne(teamId);
    const matches = await this.matchRepository.find({
      where: [
        { home: team },
        { away: team }, // This is the OR condition
      ],
      relations: { away: true, home: true },
    });
    console.log(matches);
    return matches;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    //TODO: update team-league-stadistics if not friendly
    const match = await this.matchRepository.preload({
      id,
      ...updateMatchDto,
    });
    if (!match)
      throw new NotFoundException(`Equipo con id ${id} no encontrado.`);
    return match;
  }

  async remove(id: number) {
    const match = await this.findOne(id);
    await this.matchRepository.remove(match);
  }
}
