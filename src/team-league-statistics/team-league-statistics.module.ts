import { Module } from '@nestjs/common';
import { TeamLeagueStatisticsService } from './team-league-statistics.service';
import { TeamLeagueStatisticsController } from './team-league-statistics.controller';
import { TeamsModule } from 'src/teams/teams.module';
import { LeaguesModule } from 'src/leagues/leagues.module';
import { TeamLeagueStatistic } from './entities/team-league-statistic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TeamLeagueStatisticsController],
  providers: [TeamLeagueStatisticsService],
  imports: [
    TypeOrmModule.forFeature([TeamLeagueStatistic]),
    TeamsModule,
    LeaguesModule,
  ],
})
export class TeamLeagueStatisticsModule {}
