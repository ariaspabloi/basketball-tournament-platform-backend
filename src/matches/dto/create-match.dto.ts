import { IsDateString, IsInt, MinLength } from 'class-validator';

export class CreateMatchDto {
  @IsDateString()
  dateTime: Date;

  @MinLength(4)
  place: string;

  @IsInt()
  leagueId: number;

  @IsInt()
  homeId: number;

  @IsInt()
  awayId: number;
}
