import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaguesModule } from 'src/leagues/leagues.module';
import { TeamLeagueStatisticsModule } from 'src/team-league-statistics/team-league-statistics.module';
import { TeamsModule } from 'src/teams/teams.module';
import { Match } from './entities/match.entity';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
  imports: [
    TypeOrmModule.forFeature([Match]),
    TeamsModule,
    LeaguesModule,
    TeamLeagueStatisticsModule,
  ],
})
export class MatchesModule {}
