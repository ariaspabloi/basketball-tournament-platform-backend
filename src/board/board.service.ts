import { Injectable } from '@nestjs/common';
import { MatchesService } from 'src/matches/matches.service';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class BoardService {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly playersService: PlayersService,
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
}
