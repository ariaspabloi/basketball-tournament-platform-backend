import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { DivisionsService } from 'src/divisions/divisions.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly userService: UsersService,
    private readonly divisionService: DivisionsService,
  ) {}

  async create(userId: number, createTeamDto: CreateTeamDto) {
    const { clubId, divisionId, ...teamDetails } = createTeamDto;
    const club = await this.userService.findClub(clubId || userId);
    const division = await this.divisionService.findOne(divisionId);
    const team = await this.teamRepository.create({
      ...teamDetails,
      club,
      division,
    });
    await this.teamRepository.save(team);
    return team;
  }

  async findAll() {
    const teams = await this.teamRepository.find();
    return teams;
  }

  async getCount() {
    const count = await this.teamRepository
      .createQueryBuilder('team')
      .getCount();
    return count;
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOneBy({ id });
    if (!team) throw new NotFoundException(`Equipo con ${id} no encontrado.`);
    return team;
  }

  async findOwned(clubId: number) {
    const club = await this.userService.findClub(clubId);

    const teams = await this.teamRepository
      .createQueryBuilder('team')
      .where('team.clubId = :clubId', { clubId })
      .leftJoinAndSelect('team.division', 'division')
      .leftJoinAndSelect('team.players', 'player')
      .leftJoinAndSelect('player.playersStatistics', 'playerStatistic')
      .leftJoin('playerStatistic.match', 'match')
      .leftJoin('match.home', 'homeTeam')
      .leftJoin('homeTeam.club', 'homeClub')
      .leftJoin('match.away', 'awayTeam')
      .leftJoin('awayTeam.club', 'awayClub')
      .addSelect([
        'team.id',
        'team.coach',
        'player.id',
        'player.name',
        'playerStatistic.id',
        'playerStatistic.fouls',
        'playerStatistic.freeThrows',
        'playerStatistic.doubleDoubles',
        'playerStatistic.threePointers',
        'playerStatistic.turnovers',
        'playerStatistic.offensiveRebounds',
        'playerStatistic.defensiveRebounds',
        'playerStatistic.assists',
        'playerStatistic.losses',
        'match.id',
        'match.dateTime',
        'homeTeam.id',
        'homeClub.name',
        'homeClub.image',
        'awayTeam.id',
        'awayClub.name',
        'awayClub.image',
      ])
      .getMany();

    return teams;
  }

  async teamCount(clubId: number) {
    const club = await this.userService.findClub(clubId);
    const teams = await this.teamRepository.find({
      where: { club },
    });
    const totalPlayers = teams.reduce(
      (total, team) => team.players.length + total,
      0,
    );
    return { totalTeams: teams.length, totalPlayers };
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    let team: Team;
    if (updateTeamDto.divisionId) {
      const { divisionId, ...updateDetails } = updateTeamDto;
      const division = await this.divisionService.findOne(divisionId);
      team = await this.teamRepository.preload({
        id,
        ...updateDetails,
        division,
      });
    } else {
      team = await this.teamRepository.preload({
        id,
        ...updateTeamDto,
      });
    }
    if (!team)
      throw new NotFoundException(`Equipo con id ${id} no encontrado.`);
    await this.teamRepository.save(team);
    return team;
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }
}
