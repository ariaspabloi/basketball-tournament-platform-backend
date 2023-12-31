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

  async create(createLeagueDto: CreateLeagueDto, rules: string) {
    const { organizerId, ...leagueDetails } = createLeagueDto;
    const organizer = await this.userSevice.findOrganizer(organizerId);
    const league = await this.leagueRepository.create({
      ...leagueDetails,
      organizer,
      ...(rules ? { rules } : {}),
    });
    await this.leagueRepository.save(league);
    return league;
  }

  async createByOrganizer(
    organizerId: number,
    createLeagueDto: CreateLeagueDto,
    rules,
  ) {
    const organizer = await this.userSevice.findOrganizer(organizerId);
    const league = await this.leagueRepository.create({
      ...createLeagueDto,
      organizer,
      ...(rules ? { rules } : {}),
    });
    await this.leagueRepository.save(league);
    return league;
  }

  async findAll() {
    const leagues = await this.leagueRepository.find({
      relations: ['organizer'],
    });
    return leagues;
  }

  async findLeagueMatches(id) {
    const leagueMatches = await this.leagueRepository
      .createQueryBuilder('league')
      .where('league.id = :id', { id })
      .innerJoinAndSelect('league.matches', 'match')
      .innerJoinAndSelect('match.home', 'homeTeam')
      .innerJoinAndSelect('match.away', 'awayTeam')
      .leftJoin('homeTeam.club', 'homeClub') // Corrected alias
      .leftJoin('awayTeam.club', 'awayClub') // Corrected alias
      .select([
        'league.id',
        'match',
        'homeTeam.id',
        'homeTeam.name', // Ensuring consistency in the selection
        'awayTeam.id',
        'awayTeam.name', // Ensuring consistency in the selection
        'homeClub.name', // Using the correct alias
        'awayClub.name', // Using the correct alias
      ])
      // .groupBy('match.id') // Group By might not be necessary and can be removed if causing issues
      .getOne();

    return leagueMatches;
  }

  async findLeagueClubs(id) {
    const leagueClubs = await this.leagueRepository
      .createQueryBuilder('league')
      .where('league.id = :id', { id })
      .innerJoinAndSelect('league.teamLeagueStatistics', 'teamLeagueStatistics')
      .innerJoinAndSelect('teamLeagueStatistics.team', 'team')
      .innerJoinAndSelect('team.club', 'club')
      .innerJoinAndSelect('team.division', 'division')
      .select([
        'league.id',
        'teamLeagueStatistics.id',
        'team.id',
        'club.name',
        'club.id',
        'division.id',
        'division.category',
      ])
      .getOne();
    return leagueClubs?.teamLeagueStatistics.map((item) => item.team) || [];
  }

  async countLeagueClubs(id) {
    const leagueCount = await this.leagueRepository
      .createQueryBuilder('league')
      .where('league.organizerId = :id', { id })
      .getCount();
    const matchesCount =
      (
        await this.leagueRepository
          .createQueryBuilder('league')
          .where('league.organizerId = :id', { id })
          .leftJoinAndSelect('league.matches', 'matches')
          .getOne()
      )?.matches.length || 0;
    return { leagueCount, matchesCount };
  }

  async findOne(id: number) {
    const league = await this.leagueRepository.findOneBy({ id });
    if (!league) throw new NotFoundException(`Liga con ${id} no encontrada.`);
    return league;
  }

  async findByOrganizer(organizerId: number) {
    const organizer = await this.userSevice.findOrganizer(organizerId);
    const leagues = await this.leagueRepository.find({
      where: { organizer },
      relations: ['winner'],
    });
    return leagues;
  }

  async getCount() {
    const count = await this.leagueRepository
      .createQueryBuilder('league')
      .getCount();
    return count;
  }

  async update(id: number, updateLeagueDto: UpdateLeagueDto) {
    const { winnerId, ...updateLeague } = updateLeagueDto;
    if (winnerId) {
      const winner = await this.userSevice.findClub(winnerId);
      const league = await this.leagueRepository.preload({
        id,
        ...updateLeague,
        winner,
      });
      if (!league) throw new NotFoundException(`Liga con ${id} no encontrada.`);
      await this.leagueRepository.save(league);
      return league;
    } else {
      const league = await this.leagueRepository.preload({
        id,
        ...updateLeague,
      });
      if (!league) throw new NotFoundException(`Liga con ${id} no encontrada.`);
      await this.leagueRepository.save(league);
      return league;
    }
  }

  async remove(id: number) {
    const league = await this.findOne(id);
    await this.leagueRepository.remove(league);
  }
}
