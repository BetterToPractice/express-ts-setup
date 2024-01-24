import { env } from '../libs/env';

export const appConfig = {
  name: env('APP_NAME'),
  port: Number(env('APP_PORT')),
  url: env('APP_URL'),
};
