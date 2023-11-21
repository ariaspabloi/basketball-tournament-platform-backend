import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePlayerStatisticDto } from './dto/update-player-statistic.dto';
import { PlayerStatistic } from './entities/player-statistic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersService } from 'src/players/players.service';
import * as ExcelJS from 'exceljs';
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

  async createOrUpdatePlayerStatistic(
    playerId: number,
    matchId: number,
    updatePlayerStatisticDto: UpdatePlayerStatisticDto,
  ) {
    let playerStatistic = await this.playerStatisticsRepository.findOne({
      where: {
        player: { id: playerId },
        match: { id: matchId },
      },
    });

    if (playerStatistic) {
      // Update existing statistic
      playerStatistic = await this.playerStatisticsRepository.preload({
        id: playerStatistic.id,
        ...updatePlayerStatisticDto,
      });
      if (!playerStatistic) {
        throw new NotFoundException(`PlayerStatistic not found.`);
      }
    } else {
      // Create new statistic
      playerStatistic = this.playerStatisticsRepository.create({
        player: { id: playerId },
        match: { id: matchId },
        ...updatePlayerStatisticDto,
      });
    }

    return await this.playerStatisticsRepository.save(playerStatistic);
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

  async generateStatistics(teamId: number, period: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    // Fetching player statistics
    const playerStatistics = await this.playerStatisticsRepository
      .createQueryBuilder('playerStatistics')
      .leftJoinAndSelect('playerStatistics.match', 'match')
      .leftJoinAndSelect('playerStatistics.player', 'player')
      .where('player.teamId = :teamId', { teamId })
      .andWhere('match.dateTime >= :startDate', { startDate })
      .getMany();

    // Grouping statistics by player
    const playersWithStatistics = playerStatistics.reduce((acc, stat) => {
      const { player, ...statInfo } = stat;
      if (!acc[player.id]) {
        acc[player.id] = {
          ...player,
          statistics: [],
        };
      }
      acc[player.id].statistics.push(statInfo);
      return acc;
    }, {});
    // Converting the object back to an array
    return Object.values(playersWithStatistics);
  }

  async generatePlayerStatisticsExcel(
    teamId: number,
    period: number,
  ): Promise<ExcelJS.Buffer> {
    const playersWithStatistics: any = await this.generateStatistics(
      teamId,
      period,
    );
    const workbook = new ExcelJS.Workbook();

    playersWithStatistics.forEach((player) => {
      const sheet = workbook.addWorksheet(player.name);

      // Define columns for the sheet
      sheet.columns = [
        { header: 'Fecha', key: 'matchDate', width: 20 },
        { header: 'Valoración', key: 'valoracion', width: 14 },
        { header: 'Puntos Totales', key: 'totalPoints', width: 14 },
        { header: 'Puntos', key: 'points', width: 10 },
        { header: 'Dobles', key: 'doubleDoubles', width: 15 },
        { header: 'Triples', key: 'threePointers', width: 15 },
        { header: 'Faltas', key: 'fouls', width: 10 },
        { header: 'Robos', key: 'turnovers', width: 12 },
        { header: 'Rebotes Ofensivos', key: 'offensiveRebounds', width: 18 },
        { header: 'Rebotes Defensivos', key: 'defensiveRebounds', width: 18 },
        { header: 'Asistencias', key: 'assists', width: 10 },
        { header: 'Perdidas', key: 'losses', width: 10 },
      ];

      // Add rows to the sheet
      player.statistics.forEach((stat) => {
        const totalPoints =
          stat.points + stat.doubleDoubles * 2 + stat.threePointers * 3;
        const valoracion =
          totalPoints +
          stat.turnovers +
          stat.assists +
          stat.offensiveRebounds +
          stat.defensiveRebounds -
          stat.losses;

        sheet.addRow({
          matchDate: stat.match.dateTime.toISOString().split('T')[0],
          fouls: stat.fouls,
          points: stat.points,
          doubleDoubles: stat.doubleDoubles,
          threePointers: stat.threePointers,
          turnovers: stat.turnovers,
          offensiveRebounds: stat.offensiveRebounds,
          defensiveRebounds: stat.defensiveRebounds,
          assists: stat.assists,
          losses: stat.losses,
          totalPoints: totalPoints,
          valoracion: valoracion,
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
