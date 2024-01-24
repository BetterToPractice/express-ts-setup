import * as dotenv from 'dotenv';

dotenv.config();

export const env = (key: string, defaultValue: null | string = null): string => {
  return process.env[key] ?? (defaultValue as string);
};
