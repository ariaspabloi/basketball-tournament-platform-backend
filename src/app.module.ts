import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { DivisionsModule } from './divisions/divisions.module';
import { PlayersModule } from './players/players.module';

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
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
