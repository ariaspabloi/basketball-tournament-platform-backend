import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { DivisionsModule } from 'src/divisions/divisions.module';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [TypeOrmModule.forFeature([Team]), UsersModule, DivisionsModule],
})
export class TeamsModule {}
