import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository } from 'typeorm';
import { TeamsService } from 'src/teams/teams.service';
import deleteImage from 'src/utils/deleteImage';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly teamService: TeamsService,
  ) {}

  async create(createPlayerDto: CreatePlayerDto) {
    const { teamId, ...playerDetails } = createPlayerDto;
    const team = await this.teamService.findOne(teamId);
    const player = await this.playerRepository.create({
      ...playerDetails,
      team,
    });
    await this.playerRepository.save(player);
    return { ...player };
  }

  async getCount() {
    const count = await this.playerRepository
      .createQueryBuilder('player')
      .getCount();
    return count;
  }

  async findAll() {
    const players = await this.playerRepository.find({
      relations: { team: true },
    });
    return players;
  }

  async findByTeam(teamId) {
    const players = await this.playerRepository
      .createQueryBuilder('player')
      .where('player.teamId = :teamId', { teamId })
      .getMany();
    return players;
  }

  async findOne(id: number) {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player)
      throw new NotFoundException(`Jugador con ${id} no encontrado.`);
    return player;
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    const { teamId, image, ...playerInfo } = updatePlayerDto;
    const team = await this.teamService.findOne(teamId);
    const currentPlayer = await this.playerRepository.findOneBy({ id });
    if (!currentPlayer)
      throw new NotFoundException(`Jugador con id ${id} no encontrado.`);

    const player = await this.playerRepository.preload({
      id,
      team,
      ...playerInfo,
      ...(image ? { image } : {}),
    });
    await this.playerRepository.save(player);
    if (image && currentPlayer.image) deleteImage(currentPlayer.image);
    return player;
  }

  async remove(id: number) {
    const player = await this.findOne(id);
    await this.playerRepository.remove(player);
  }
}
