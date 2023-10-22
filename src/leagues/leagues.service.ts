import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeagueDto } from './dto/create-league.dto';
import { UpdateLeagueDto } from './dto/update-league.dto';
import { League } from './entities/league.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LeaguesService {
  constructor(
    @InjectRepository(League)
    private readonly leagueRepository: Repository<League>,
    private readonly userSevice: UsersService,
  ) {}

  async create(createLeagueDto: CreateLeagueDto) {
    const { organizerId, ...leagueDetails } = createLeagueDto;
    const organizer = await this.userSevice.findOrganizer(organizerId);
    const league = await this.leagueRepository.create({
      ...leagueDetails,
      organizer,
    });
    await this.leagueRepository.save(league);
    return league;
  }

  async createByOrganizer(
    organizerId: number,
    createLeagueDto: CreateLeagueDto,
  ) {
    const organizer = await this.userSevice.findOrganizer(organizerId);
    const league = await this.leagueRepository.create({
      ...createLeagueDto,
      organizer,
    });
    await this.leagueRepository.save(league);
    return league;
  }

  async findAll() {
    const leagues = await this.leagueRepository.find();
    return leagues;
  }

  async findLeagueMatches(id) {
    const leagueMatches = await this.leagueRepository
      .createQueryBuilder('league')
      .where('league.id = :id', { id })
      .innerJoinAndSelect('league.matches', 'match')
      .innerJoinAndSelect('match.home', 'homeTeam')
      .innerJoinAndSelect('match.away', 'awayTeam')
      .innerJoinAndSelect('awayTeam.club', 'awayClub')
      .innerJoinAndSelect('homeTeam.club', 'homeClub')
      .select([
        'league.id',
        'match',
        'homeTeam',
        'awayTeam',
        'awayClub.name',
        'homeClub.name',
      ])
      .getOne();

    /*
    const playerStatistics = await this.playerStatisticsRepository
      .createQueryBuilder('playerStatistics')
      .where('playerStatistics.player = :playerId', { playerId })
      .leftJoinAndSelect('playerStatistics.match', 'match')
      .leftJoinAndSelect('match.home', 'home')
      .leftJoinAndSelect('home.club', 'homeClub')
      .leftJoinAndSelect('match.away', 'away')
      .leftJoinAndSelect('away.club', 'awayClub')
      .getMany(); */
    return leagueMatches;
  }

  async findOne(id: number) {
    const league = await this.leagueRepository.findOneBy({ id });
    if (!league) throw new NotFoundException(`Liga con ${id} no encontrada.`);
    return league;
  }

  async findByOrganizer(organizerId: number) {
    const organizer = await this.userSevice.findOrganizer(organizerId);
    const leagues = await this.leagueRepository.find({ where: { organizer } });
    return leagues;
  }

  async getCount() {
    const count = await this.leagueRepository
      .createQueryBuilder('league')
      .getCount();
    return count;
  }

  async update(id: number, updateLeagueDto: UpdateLeagueDto) {
    //TODO: borrar matches si se cambia las fechas
    const league = await this.leagueRepository.preload({
      id,
      ...updateLeagueDto,
    });
    if (!league) throw new NotFoundException(`Liga con ${id} no encontrada.`);
    await this.leagueRepository.save(league);
    return league;
  }

  async remove(id: number) {
    const league = await this.findOne(id);
    await this.leagueRepository.remove(league);
  }
}
