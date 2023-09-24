import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamLeagueStatisticDto } from './create-team-league-statistic.dto';

export class UpdateTeamLeagueStatisticDto extends PartialType(
  CreateTeamLeagueStatisticDto,
) {}
