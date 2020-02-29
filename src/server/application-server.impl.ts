import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressSession from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';


import { RootRouter } from './router';
import { authenticationMiddleware } from './middleware';

import { ISequelizeDataSource } from '../model';
import {EUserRight} from "../entity/UserModel";
import {IApplicationServer} from "./ApplicationServerInterface";
import {IApplicationModel} from "../model/ApplicationModelInterface";
import {IHTTPConfig} from "../application/ApplicationConfigInterface";
import {
  EApplicationOperationResultStatus,
  IApplicationInitResult,
  IApplicationRunResult
} from "../application/ApplicationInterface";

export interface IRoutes {
  USER_ROUTE: string;
  AUTH_ROUTE: string;
  ME_ROUTE: string;
}

export interface IUserToken {
  userId: string,
  right: EUserRight
}

export class ApplicationServerImpl implements IApplicationServer<ISequelizeDataSource> {

  private static instance: ApplicationServerImpl;
  private model: IApplicationModel<ISequelizeDataSource>;

  private expressApp: Application;
  private config: IHTTPConfig;

  private constructor() {
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ApplicationServerImpl();
    }
    return this.instance;
  }

  init(config: IHTTPConfig, model: IApplicationModel<ISequelizeDataSource>): Promise<IApplicationInitResult> {
    return new Promise((resolve, reject) => {
      try {
        this.model = model;
        this.expressApp = express();
        this.config = config;

        const baseUrl = `/api/${config.apiVersion}`;

        this.initMiddleware(this.expressApp, baseUrl);

        const router = new RootRouter<ISequelizeDataSource>(model);
        router.setup(this.expressApp, baseUrl, this.getRoutes(baseUrl));

        return resolve({
          status: EApplicationOperationResultStatus.SUCCESS,
          message: `Application initialized`,
        });
      } catch (e) {
        return reject({
          status: EApplicationOperationResultStatus.ERROR,
          message: e.message,
        });
      }
    });
  }

  run(): Promise<IApplicationRunResult> {
    return new Promise<IApplicationRunResult>(((resolve, reject) => {
      this.expressApp.listen(this.config.port, error => {
        if (error) {
          reject({
            status: EApplicationOperationResultStatus.ERROR,
            message: error.message,
          });
        }

        resolve({
          status: EApplicationOperationResultStatus.SUCCESS,
          message: `Application successfully started. No problems found`,
        });
      });
    }));
  }

  private initMiddleware(app: Application, baseUrl: string) {
    this.initBodyParser(app, baseUrl);
    this.initCors(app, baseUrl);
    this.initSessionStorage(app, baseUrl);
    const routes = this.getRoutes(baseUrl);
    this.initAuthentication(app, this.getAuthenticatedRoutes(routes));
  }

  private initBodyParser(app: Application, baseUrl: string) {
    app.use(baseUrl, bodyParser.json());
  }

  private initCors(app: Application, baseUrl: string) {
    app.use(baseUrl, cors({
      origin: this.config.corsOrigins,
      credentials: true,
    }));
  }

  private initSessionStorage(app: Application, baseUrl: string) {
    const SequelizeStore = connectSessionSequelize(expressSession.Store);
    const myStore = new SequelizeStore({
      db: this.model.getDataSource().sequelize
    });

    app.use(baseUrl, expressSession({
      name: '_APP-NAME',
      secret: this.config.sessionSecret,
      store: myStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // five year cookie
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
      }
    }));

    myStore.sync();
  }

  private initAuthentication(app: Application, routes: string[]) {
    app.use(routes, authenticationMiddleware(this.config.tokenSecret));
  }

  private getRoutes(baseUrl: string): IRoutes {
    return {
      USER_ROUTE: `${baseUrl}/user`,
      AUTH_ROUTE: `${baseUrl}/auth`,
      ME_ROUTE: `${baseUrl}/auth/me`
    };
  }

  private getAuthenticatedRoutes(routes: IRoutes): string[] {
    return [
      routes.USER_ROUTE,
      routes.ME_ROUTE,
    ];
  }

}