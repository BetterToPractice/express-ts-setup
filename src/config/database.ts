import { env } from '../libs/env';

export const dbConfig = {
  type: env('DB_TYPE'),
  host: env('DB_HOST'),
  port: Number(env('DB_PORT')),
  name: env('DB_NAME'),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
};
