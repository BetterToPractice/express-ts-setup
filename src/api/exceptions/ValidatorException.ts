import { HttpError } from 'routing-controllers';

export class ValidatorException {
  data: string | object;
  httpCode: number = 400;
  message: string = 'Error Validation';

  constructor(data: string | object, statusCode: number = 400) {
    this.data = data;
    this.httpCode = statusCode;
  }
}
