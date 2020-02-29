export type TDatabaseDialect =  'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb';

export interface IHTTPConfig {
  port: number;
  apiVersion: string;
  sessionSecret: string;
  tokenSecret: string;
  corsOrigins: string[];
}

export interface IDatabaseConfig {
  schemaName: string;
  port: number;
  host: string;
  user: string;
  password: string;
  dialect: TDatabaseDialect;
}

export interface IApplicationConfig {
  http: IHTTPConfig;
  database: IDatabaseConfig;
}
