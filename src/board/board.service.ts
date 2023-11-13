import { Injectable } from '@nestjs/common';
import { MatchesService } from 'src/matches/matches.service';
import { PlayerStatisticsService } from 'src/player-statistics/player-statistics.service';
import { PlayersService } from 'src/players/players.service';
import transformArrays from 'src/utils/tranformMatchInfo';
interface PlayerInfo {
  id: number;
  points: number;
  fouls: number;
}
interface MatchInfo {
  homePoints: number;
  awayPoints: number;
}
@Injectable()
export class BoardService {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly playersService: PlayersService,
    private readonly playersStatisticsService: PlayerStatisticsService,
  ) {}

  async getMatchInfo(id: number) {
    const match = await this.matchesService.findOne(id);
    const homePlayersFull = await this.playersService.findByTeam(match.home.id);
    const awayPlayersFull = await this.playersService.findByTeam(match.away.id);
    const playerInfo = (player) => ({
      id: player.id,
      shirtNumber: player.shirtNumber,
      name: player.name,
    });

    const homePlayers = homePlayersFull.map(playerInfo);
    const awayPlayers = awayPlayersFull.map(playerInfo);
    const away = match.away.club.name;
    const home = match.home.club.name;

    return { away, home, awayPlayers, homePlayers };
  }

  async saveMatch({
    matchId,
    awayPoints,
    awayPlayersFaults,
    awayPlayersPoints,
    homePoints,
    homePlayersFaults,
    homePlayersPoints,
  }) {
    try {
      const playersInfo: PlayerInfo[] = [
        ...transformArrays(awayPlayersFaults, awayPlayersPoints),
        ...transformArrays(homePlayersFaults, homePlayersPoints),
      ];

      await Promise.all(
        playersInfo.map(async (player) => {
          await this.playersStatisticsService.createOrUpdatePlayerStatistic(
            player.id,
            matchId,
            { points: player.points, fouls: player.fouls },
          );
        }),
      );

      const matchInfo: MatchInfo = { homePoints, awayPoints };
      await this.matchesService.update(matchId, matchInfo);

      return 'Guardado exitoso';
    } catch (error) {
      console.error(error);
      return 'Error guardando';
    }
  }
}
