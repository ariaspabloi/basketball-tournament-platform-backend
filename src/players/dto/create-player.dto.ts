/* eslint-disable */
import { Options } from '@nestjs/common';
import { IsDate, IsDateString, Matches, MinLength } from 'class-validator';

export class CreatePlayerDto {
  // prettier-ignore
  @Matches("^[\p{L}']+ [\p{L}']+ (?:[\p{L}']+ [\p{L}']+)?$")
  @MinLength(20)
  name: string;
  // prettier-ignore
  @Matches('^\d{7,8}-[\dkK]$')
  rut: string;

  @IsOnlyDate()
  brithday: string;
}

import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like 2020-12-08',
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
          return typeof value === 'string' && regex.test(value);
        },
      },
    });
  };
}
