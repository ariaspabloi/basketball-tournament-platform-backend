import { IsInt, IsOptional, Matches } from 'class-validator';

export class CreateTeamDto {
  @Matches(/^[a-zA-Z]{3,}( {1,2}[a-zA-Z]{3,}){0,}$/)
  coach: string;
  @IsOptional()
  @IsInt()
  clubId: number;
  @IsInt()
  divisionId: number;
}
