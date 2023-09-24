import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamLeagueStatistic } from './entities/team-league-statistic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamLeagueStatisticsService {
  constructor(
    @InjectRepository(TeamLeagueStatistic)
    private readonly teamLeagueRepository: Repository<TeamLeagueStatistic>,
  ) {}

  async findLeagueStatistics(leagueId: number) {
    const leagueStatistics = await this.teamLeagueRepository.find({
      where: { league: { id: leagueId } },
    });
    if (!leagueStatistics)
      throw new NotFoundException('Estadistica no encontrada.');
    return leagueStatistics;
  }
}
