import { Module } from '@nestjs/common';
import { PlayerStatisticsService } from './player-statistics.service';
import { PlayerStatisticsController } from './player-statistics.controller';
import { PlayerStatistic } from './entities/player-statistic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from 'src/players/players.module';

@Module({
  controllers: [PlayerStatisticsController],
  providers: [PlayerStatisticsService],
  imports: [TypeOrmModule.forFeature([PlayerStatistic]), PlayersModule],
})
export class PlayerStatisticsModule {}
