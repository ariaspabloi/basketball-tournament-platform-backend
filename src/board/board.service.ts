import { Injectable } from '@nestjs/common';
import { MatchesService } from 'src/matches/matches.service';
import { PlayerStatisticsService } from 'src/player-statistics/player-statistics.service';
import { PlayersService } from 'src/players/players.service';
import { TeamLeagueStatisticsService } from 'src/team-league-statistics/team-league-statistics.service';
import transformArrays from 'src/utils/tranformMatchInfo';
interface PlayerInfo {
  id: number;
  freeThrows: number;
  doubleDoubles: number;
  threePointers: number;
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
    private readonly teamLeagueStatisticsService: TeamLeagueStatisticsService,
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
    awayPlayersPointsFull,
    homePoints,
    homePlayersFaults,
    homePlayersPointsFull,
  }) {
    try {
      const playersInfo: PlayerInfo[] = [
        ...transformArrays(awayPlayersFaults, awayPlayersPointsFull),
        ...transformArrays(homePlayersFaults, homePlayersPointsFull),
      ];

      await Promise.all(
        playersInfo.map(async (player) => {
          await this.playersStatisticsService.createOrUpdatePlayerStatistic(
            player.id,
            matchId,
            {
              freeThrows: player.freeThrows,
              doubleDoubles: player.doubleDoubles,
              threePointers: player.threePointers,
              fouls: player.fouls,
            },
          );
        }),
      );

      const matchInfo: MatchInfo = { homePoints, awayPoints };
      const match = await this.matchesService.update(matchId, matchInfo);
      const fullMatchInfo = await this.matchesService.findOneLeague(match.id);
      await this.teamLeagueStatisticsService.updateTeamStatistics(
        fullMatchInfo.home.id,
        fullMatchInfo.away.id,
        awayPoints,
        homePoints,
        fullMatchInfo.league.id,
      );
      return { match, fullMatchInfo };
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
