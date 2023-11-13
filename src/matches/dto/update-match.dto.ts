import { IsDateString, IsInt, IsOptional, MinLength } from 'class-validator';

export class UpdateMatchDto {
  @IsOptional()
  @IsDateString()
  dateTime?: Date;

  @IsOptional()
  @MinLength(4)
  place?: string;

  @IsOptional()
  @IsInt()
  homePoints?;

  @IsOptional()
  @IsInt()
  awayPoints?;
}
