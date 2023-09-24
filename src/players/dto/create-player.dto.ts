import { IsInt, Matches, MinLength } from 'class-validator';
import { IsOnlyDate } from '../../utils/date.validator';

export class CreatePlayerDto {
  @Matches(/^[a-zA-Z]{3,}( {1,2}[a-zA-Z]{3,}){0,}$/)
  @MinLength(20)
  name: string;
  @Matches(/^\d{7,8}-[\dkK]$/)
  rut: string;

  @IsOnlyDate()
  birthdate: string;

  @IsInt()
  teamId: number;
}
