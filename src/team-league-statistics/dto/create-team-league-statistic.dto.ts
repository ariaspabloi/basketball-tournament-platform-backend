import { IsInt } from 'class-validator';

export class CreateTeamLeagueStatisticDto {
  @IsInt()
  teamId: number;
  @IsInt()
  leagueId: number;
}
