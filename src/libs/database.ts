import { DataSource } from 'typeorm';
import { dbConfig } from '../config/database';
import * as path from 'path';

const AppDataSource = new DataSource({
  type: dbConfig.type as any,
  host: dbConfig.host,
  port: Number(dbConfig.port),
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.name,
  entities: [path.join(__dirname, '..', 'models/*.{js,ts}')],
  migrations: [path.join(__dirname, '..', 'migrations/*.{js,ts}')],
});

export default AppDataSource;
