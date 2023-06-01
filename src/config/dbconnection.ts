import { Sequelize } from "sequelize-typescript";
const {DB_HOST, DB_USER, DB_PASSWORD, DB_NAME} = process.env
import {model} from '../model/model';

const connection = new Sequelize({
  dialect: "mysql",
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  logging: false,
  models: [model],
});

export default connection;
