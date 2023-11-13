import { IsInt, IsOptional } from 'class-validator';

export class UpdatePlayerStatisticDto {
  @IsOptional()
  @IsInt()
  passes?: number;

  @IsOptional()
  @IsInt()
  points?: number;

  @IsOptional()
  @IsInt()
  baskets?: number;

  @IsOptional()
  @IsInt()
  fouls?: number;

  @IsOptional()
  @IsInt()
  assists?: number;

  @IsOptional()
  @IsInt()
  steals?: number;

  @IsOptional()
  @IsInt()
  rebounds?: number;

  @IsOptional()
  @IsInt()
  freeThrows?: number;

  @IsOptional()
  @IsInt()
  doubleDoubles?: number;

  @IsOptional()
  @IsInt()
  threePointers?: number;
}
