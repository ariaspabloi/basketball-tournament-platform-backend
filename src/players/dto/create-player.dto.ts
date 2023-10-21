//@Matches(/^\d{7,8}-[\dkK]$/)
import { IsInt, IsString, IsOptional } from 'class-validator';
import { IsOnlyDate } from '../../utils/date.validator';

export class CreatePlayerDto {
  //@Matches(/^[a-zA-Z]{3,}( {1,2}[a-zA-Z]{3,}){0,}$/)
  @IsString()
  name: string;

  @IsString()
  rut: string;

  @IsOnlyDate()
  birthdate: string;

  @IsInt()
  teamId: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  emergencyName?: string;

  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsInt()
  weight?: number;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsInt()
  shirtNumber?: number;

  @IsOptional()
  @IsString()
  shirtSize?: string;

  @IsOptional()
  @IsString()
  shortsSize?: string;

  @IsOptional()
  @IsString()
  shoeSize?: string;

  @IsOptional()
  @IsString()
  clinicalDetail?: string;
}
