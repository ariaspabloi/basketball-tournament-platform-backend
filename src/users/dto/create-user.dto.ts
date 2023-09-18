import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(4)
  name: string;
  @IsEmail()
  email: string;
  @MinLength(6)
  password: string;
}
