import { BadRequestError } from 'routing-controllers';

export class AuthInvalidCredentials extends BadRequestError {
  constructor() {
    super('Invalid credentials');
  }
}
