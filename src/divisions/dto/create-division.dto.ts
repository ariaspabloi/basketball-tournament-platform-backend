import { MinLength } from 'class-validator';

export class CreateDivisionDto {
  @MinLength(2)
  category: string;
}
