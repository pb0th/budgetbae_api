import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueConstraintException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
