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

    console.log('playerStatistics');
    // Fetching player statistics
    const playerStatistics = await this.playerStatisticsRepository
      .createQueryBuilder('playerStatistics')
      .leftJoinAndSelect('playerStatistics.match', 'match')
      .leftJoin('match.home', 'home')
      .addSelect('home')
      .leftJoin('home.club', 'homeClub')
      .addSelect('homeClub.name')
      .leftJoin('match.away', 'awayClub')
      .addSelect('awayClub')
      .leftJoin('awayClub.club', 'club')
      .addSelect('club.name')
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
    console.log(
      JSON.stringify(
        Object.values(playersWithStatistics)[0]['statistics'],
        null,
        4,
      ),
    );
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

      // Add title row with large text
      const titleRow = sheet.addRow(['Estadísticas de ' + player.name]);
      titleRow.font = { size: 16, bold: true };
      // Merge cells for title row
      sheet.mergeCells('A1:L1');

      // Add a blank row
      sheet.addRow([]);

      // Add header row
      sheet.addRow([
        'Fecha',
        'Valoración',
        'Local',
        'Visita',
        'Puntos Totales',
        'Tiros libres',
        'Dobles',
        'Triples',
        'Faltas',
        'Robos',
        'Rebotes Ofensivos',
        'Rebotes Defensivos',
        'Asistencias',
        'Perdidas',
      ]);

      // Add data rows
      player.statistics.forEach((stat) => {
        const totalPoints =
          stat.freeThrows + stat.doubleDoubles * 2 + stat.threePointers * 3;
        const valoracion =
          totalPoints +
          stat.turnovers +
          stat.assists +
          stat.offensiveRebounds +
          stat.defensiveRebounds -
          stat.losses;

        sheet.addRow([
          stat.match.dateTime.toISOString().split('T')[0], // Fecha
          valoracion, // Valoración
          stat.match.home.club.name, // Local
          stat.match.away.club.name, // Visita
          totalPoints, // Puntos Totales
          stat.freeThrows, // Puntos
          stat.doubleDoubles, // Dobles
          stat.threePointers, // Triples
          stat.fouls, // Faltas
          stat.turnovers, // Robos
          stat.offensiveRebounds, // Rebotes Ofensivos
          stat.defensiveRebounds, // Rebotes Defensivos
          stat.assists, // Asistencias
          stat.losses, // Perdidas
        ]);
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
}
