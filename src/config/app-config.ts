import { dbPassword } from './secrets.local';

export const appConfig = {
  port: 3000,
  database: {
    host: 'localhost',
    port: 5432,
    user: 'romax-admin',
    database: 'asigna_tech_db',
    password: dbPassword
  }
};
