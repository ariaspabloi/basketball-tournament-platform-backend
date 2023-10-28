import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardGateway } from './board.gateway';
import { MatchesModule } from 'src/matches/matches.module';
import { PlayersModule } from 'src/players/players.module';

@Module({
  providers: [BoardGateway, BoardService],
  imports: [MatchesModule, PlayersModule],
})
export class BoardModule {}
