import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardGateway } from './board.gateway';
import { MatchesModule } from 'src/matches/matches.module';
import { PlayersModule } from 'src/players/players.module';
import { PlayerStatisticsModule } from 'src/player-statistics/player-statistics.module';
import { TeamLeagueStatisticsModule } from 'src/team-league-statistics/team-league-statistics.module';

@Module({
  providers: [BoardGateway, BoardService],
  imports: [
    MatchesModule,
    PlayersModule,
    PlayerStatisticsModule,
    TeamLeagueStatisticsModule,
  ],
})
export class BoardModule {}
