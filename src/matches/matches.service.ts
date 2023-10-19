import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { Repository } from 'typeorm';
import { TeamsService } from 'src/teams/teams.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly teamService: TeamsService,
    private readonly organizerService: UsersService,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const { homeId, awayId, organizerId, ...matchDetails } = createMatchDto;
    const home = await this.teamService.findOne(homeId);
    const away = await this.teamService.findOne(awayId);
    const organizer = await this.organizerService.findOrganizer(organizerId);
    const match = await this.matchRepository.create({
      friendlyMatch: true,
      home,
      away,
      organizer,
      ...matchDetails,
    });
    await this.matchRepository.save(match);
    return match;
  }

  async findAll() {
    const teams = await this.matchRepository.find();
    return teams;
  }

  async findOne(id: number) {
    const match = await this.matchRepository.findOneBy({ id });
    if (!match)
      throw new NotFoundException(`Equipo con id ${id} no encontrado.`);
    return match;
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
    await this.matchRepository.save(match);
    return match;
  }

  async remove(id: number) {
    const match = await this.findOne(id);
    if (!match.friendlyMatch)
      throw new BadRequestException(
        'No se puede borrar, el partido no es amistoso.',
      );
    await this.matchRepository.remove(match);
  }
}
