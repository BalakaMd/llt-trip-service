import { Sequelize } from 'sequelize';
import { initModels } from '../db/index';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export async function initDb() {
  initModels(sequelize);

  // create/update tables with alter: true to add new columns
  await sequelize.sync({ alter: true });
}

export default sequelize;
