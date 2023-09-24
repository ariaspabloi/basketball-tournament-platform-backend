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

  async create(createTeamDto: CreateTeamDto) {
    const { clubId, divisionId, ...teamDetails } = createTeamDto;
    const club = await this.userService.findClub(clubId);
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

  async findOne(id: number) {
    const team = await this.teamRepository.findOneBy({ id });
    if (!team) throw new NotFoundException(`Equipo con ${id} no encontrado.`);
    return team;
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
