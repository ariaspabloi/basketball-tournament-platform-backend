import { IsInt, IsOptional } from 'class-validator';

export class UpdatePlayerStatisticDto {
  @IsOptional()
  @IsInt()
  freeThrows?: number;

  @IsOptional()
  @IsInt()
  fouls?: number;

  @IsOptional()
  @IsInt()
  doubleDoubles?: number;

  @IsOptional()
  @IsInt()
  threePointers?: number;

  @IsOptional()
  @IsInt()
  turnovers?: number;

  @IsOptional()
  @IsInt()
  offensiveRebounds?: number;

  @IsOptional()
  @IsInt()
  defensiveRebounds?: number;

  @IsOptional()
  @IsInt()
  assists?: number;

  @IsOptional()
  @IsInt()
  losses?: number;
}
