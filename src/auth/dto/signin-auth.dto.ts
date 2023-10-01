import { IsString } from 'class-validator';

export class SigninAuthDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
