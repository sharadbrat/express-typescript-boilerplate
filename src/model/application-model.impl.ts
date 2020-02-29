import { Sequelize } from 'sequelize';


import { ISequelizeDataSource } from './sequelize-data-source.interface';
import { sequelizeDefine } from './sequelize-model-definition';
import {IApplicationModel} from "./ApplicationModelInterface";
import {IDatabaseConfig} from "../application/ApplicationConfigInterface";
import {IUserDAO} from "./dao/UserDaoInterface";
import {UserDAOImpl} from "./dao/user.dao.impl";


export class ApplicationModelImpl implements IApplicationModel<ISequelizeDataSource> {

  private static instance: IApplicationModel<ISequelizeDataSource>;
  private dataSource: ISequelizeDataSource;

  private constructor() {
  }

  static getInstance(): IApplicationModel<ISequelizeDataSource> {
    if (!this.instance) {
      this.instance = new ApplicationModelImpl();
    }
    return this.instance;
  }

  init(config: IDatabaseConfig): Promise<ISequelizeDataSource> {
    const sequelize = new Sequelize({
      dialect: config.dialect,
      database: config.schemaName,
      host: config.host,
      port: config.port,
      username: config.user,
      password: config.password,
    });

    const sequelizeDataSource: ISequelizeDataSource = {
      sequelize: sequelize,
      models: sequelizeDefine(sequelize),
    };

    this.dataSource = sequelizeDataSource;

    // sequelize has bluebird promises by default, so we have to cast bluebird promises to native ones
    return Promise.resolve<ISequelizeDataSource>(sequelize.sync().then(() => {
      // init all the DAO classes with sequelizeDataSource
      this.initDAOs(sequelizeDataSource);
      return sequelizeDataSource;
    }));
  }

  getDataSource(): ISequelizeDataSource {
    return this.dataSource;
  }

  getUserDAO(): IUserDAO<ISequelizeDataSource> {
    return UserDAOImpl.getInstance();
  }

  private initDAOs(sequelizeDataSource: ISequelizeDataSource) {
    this.getUserDAO().init(sequelizeDataSource);
  }

}
