import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { IsOnlyDate } from 'src/utils/date.validator';

export class CreateLeagueDto {
  @MinLength(4)
  name: string;

  @IsOptional()
  @IsString()
  rules: string;

  @IsOnlyDate()
  startDate: string;

  @IsOnlyDate()
  endDate: string;

  @IsOptional()
  @IsInt()
  organizerId: number;
}
