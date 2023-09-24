import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { DivisionsModule } from './divisions/divisions.module';
import { PlayersModule } from './players/players.module';
import { LeaguesModule } from './leagues/leagues.module';
import { TeamLeagueStatisticsModule } from './team-league-statistics/team-league-statistics.module';
import { MatchesModule } from './matches/matches.module';
import { PlayerStatisticsModule } from './player-statistics/player-statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
    TeamsModule,
    DivisionsModule,
    PlayersModule,
    LeaguesModule,
    TeamLeagueStatisticsModule,
    MatchesModule,
    PlayerStatisticsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
