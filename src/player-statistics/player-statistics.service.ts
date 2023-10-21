import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePlayerStatisticDto } from './dto/update-player-statistic.dto';
import { PlayerStatistic } from './entities/player-statistic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersService } from 'src/players/players.service';
//TODO: Get all estadisticas de un partido
@Injectable()
export class PlayerStatisticsService {
  constructor(
    @InjectRepository(PlayerStatistic)
    private readonly playerStatisticsRepository: Repository<PlayerStatistic>,
    private readonly playerService: PlayersService,
  ) {}

  async findOne(id: number) {
    const playerStatistics = await this.playerStatisticsRepository.findOneBy({
      id,
    });
    if (!playerStatistics)
      throw new NotFoundException(`Match with ${id} not found`);
    return playerStatistics;
  }

  async findOneByPlayer(playerId: number) {
    const playerStatistics = await this.playerStatisticsRepository
      .createQueryBuilder('playerStatistics')
      .where('playerStatistics.player = :playerId', { playerId })
      .leftJoinAndSelect('playerStatistics.match', 'match')
      .leftJoinAndSelect('match.home', 'home')
      .leftJoinAndSelect('home.club', 'homeClub')
      .leftJoinAndSelect('match.away', 'away')
      .leftJoinAndSelect('away.club', 'awayClub')
      .getMany();
    return playerStatistics;
  }

  async update(id: number, updatePlayerStatisticDto: UpdatePlayerStatisticDto) {
    const playerStatistic = await this.playerStatisticsRepository.preload({
      id,
      ...updatePlayerStatisticDto,
    });
    if (!playerStatistic)
      throw new NotFoundException(
        `Estadistica de jugador con id ${id} no encontrado.`,
      );
    await this.playerStatisticsRepository.save(playerStatistic);
    return playerStatistic;
  }
}
