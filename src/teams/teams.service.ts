import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { DivisionsService } from 'src/divisions/divisions.service';

@Injectable()
export class TeamsService {
  private readonly logger = new Logger('TeamsService');

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    //TODO: try readonly
    private userService: UsersService,
    private divisionService: DivisionsService,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    try {
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
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const teams = await this.teamRepository.find();
    return teams;
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOneBy({ id });
    if (!team) throw new NotFoundException(`Team with ${id} not found`);
    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    try {
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
      if (!team) throw new NotFoundException(`Team with id ${id} not found`);
      await this.teamRepository.save(team);
      return team;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
