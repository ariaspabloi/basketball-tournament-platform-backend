import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RolesAuthGuard } from './auth/roles-auth.guard';
import { BoardModule } from './board/board.module';
import { config } from './config/config';
import { DivisionsModule } from './divisions/divisions.module';
import { FilesModule } from './files/files.module';
import { LeaguesModule } from './leagues/leagues.module';
import { MatchesModule } from './matches/matches.module';
import { PlayerStatisticsModule } from './player-statistics/player-statistics.module';
import { PlayersModule } from './players/players.module';
import { TeamLeagueStatisticsModule } from './team-league-statistics/team-league-statistics.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      ssl: false,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TeamsModule,
    DivisionsModule,
    PlayersModule,
    LeaguesModule,
    TeamLeagueStatisticsModule,
    MatchesModule,
    PlayerStatisticsModule,
    AuthModule,
    BoardModule,
    FilesModule,
  ],
  //mariadb ssl: false,

  /*
  postgres
        ssl: {
        rejectUnauthorized: false,
      },
   */
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesAuthGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
