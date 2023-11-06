import { IsInt, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsOnlyDate } from '../../utils/date.validator';

export class CreatePlayerDto {
  @IsString()
  // @Matches(/^[a-zA-Z]{3,}( {1,2}[a-zA-Z]{3,}){0,}$/)
  name: string;

  @IsString()
  // @Matches(/^\d{7,8}-[\dkK]$/)
  rut: string;

  @IsOnlyDate()
  birthdate: string;

  @IsOptional()
  @IsString()
  image: string;

  @Transform(({ value }) => Number(value))
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
  @Transform(({ value }) => Number(value))
  @IsInt()
  height?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  weight?: number;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
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
