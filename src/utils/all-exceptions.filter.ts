import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let httpStatus;
    let message = exception?.response?.message[0] || (exception as any).message;

    if (exception instanceof HttpException) {
      httpStatus = (exception as HttpException).getStatus();
    } else if (
      exception instanceof QueryFailedError &&
      (exception as any).code === '23505'
    ) {
      httpStatus = HttpStatus.CONFLICT;
      message = (exception as any).detail
        .replace('Key', 'Atributo')
        .replace('already exists.', 'ya existe.');
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
