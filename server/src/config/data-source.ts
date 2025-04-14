import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ProjectActivity } from '../entities/ProjectActivity';
import { ProjectActivityProgress } from '../entities/ProjectActivityProgress';


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'Dashboard',
    synchronize: false,
    logging: true,
    entities: [ProjectActivity, ProjectActivityProgress],
    migrations: [],
    subscribers: [],
  });