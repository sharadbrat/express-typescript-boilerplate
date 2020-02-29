import { IApplicationConfig, IDatabaseConfig, IHTTPConfig } from "./application/ApplicationConfigInterface";


export const DATABASE_CONFIG: IDatabaseConfig = {
  schemaName: 'schemaName',
  port: 1234,
  host: 'localhost',
  user: 'admin',
  password: '123456',
  dialect: 'mysql',
};

export const HTTP_CONFIG: IHTTPConfig = {
  port: 3001,
  apiVersion: 'v1',
  sessionSecret: 'sessionSecret',
  tokenSecret: 'tokenSecret',
  corsOrigins: ['*'],
};

export const APPLICATION_CONFIG: IApplicationConfig = {
  database: DATABASE_CONFIG,
  http: HTTP_CONFIG,
};
