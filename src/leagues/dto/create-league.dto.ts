import { Transform } from 'class-transformer';
import { IsInt, IsOptional, MinLength } from 'class-validator';
import { IsOnlyDate } from 'src/utils/date.validator';

export class CreateLeagueDto {
  @MinLength(4)
  name: string;

  @IsOnlyDate()
  startDate: string;

  @IsOnlyDate()
  endDate: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  organizerId: number;
}
