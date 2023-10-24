import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLeagueDto } from './create-league.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateLeagueDto extends PartialType(
  OmitType(CreateLeagueDto, ['organizerId'] as const),
) {
  @IsOptional()
  @IsInt()
  winnerId: number;
}
