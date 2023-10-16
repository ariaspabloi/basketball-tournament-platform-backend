import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { Player } from './entities/player.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService],
  imports: [TypeOrmModule.forFeature([Player]), TeamsModule],
})
export class PlayersModule {}
