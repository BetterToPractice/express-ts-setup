import { env } from '../libs/env';

export const authConfig = {
  JwtSecret: env('JWT_SECRET', 'foobar'),
  ExpiresIn: env('JWT_EXPIRES_IN', '24h'),
};
