import { IsInt, Matches } from 'class-validator';

export class CreateTeamDto {
  @Matches(/^[\p{L}']+ [\p{L}']+ (?:[\p{L}']+ [\p{L}']+)?$/)
  coach: string;
  @IsInt()
  clubId: number;
  @IsInt()
  divisionId: number;
}
