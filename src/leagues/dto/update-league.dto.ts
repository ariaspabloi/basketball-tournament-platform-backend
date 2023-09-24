import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateLeagueDto } from './create-league.dto';

export class UpdateLeagueDto extends PartialType(
  OmitType(CreateLeagueDto, ['organizerId'] as const),
) {}
