import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger('TeamsService');
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private teamService: TeamsService,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    try {
      const { teamId, ...playerDetails } = createPlayerDto;
      const team = await this.teamService.findOne(teamId);
      const player = await this.playerRepository.create({
        ...playerDetails,
        team,
      });
      await this.playerRepository.save(player);
      return player
      ;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    const players = await this.playerRepository.find();
    return players;
  }

  async findOne(id: number) {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player) throw new NotFoundException(`Player with ${id} not found`);
    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    try {
      let player: Player;
      if (updatePlayerDto.teamId) {
        const { teamId, ...updateDetails } = updatePlayerDto;
        const team = await this.teamService.findOne(teamId);
        player = await this.playerRepository.preload({
          id,
          ...updateDetails,
          team,
        });
      } else {
        player = await this.playerRepository.preload({
          id,
          ...updatePlayerDto,
        });
      }
      if (!player)
        throw new NotFoundException(`Player with id ${id} not found`);
      await this.playerRepository.save(player);
      return player;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    await this.playerRepository.remove(player);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
