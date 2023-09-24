import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesController } from './matches.controller';
import { Match } from './entities/match.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  imports: [TypeOrmModule.forFeature([Match]), UsersModule, TeamsModule],
})
export class MatchesModule {}
