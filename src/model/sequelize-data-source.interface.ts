import { Model, Sequelize } from 'sequelize';

export type TSequelizeModel = { new (): Model } & typeof Model;

export interface ISequelizeModels {
  user: TSequelizeModel;
}

export interface ISequelizeDataSource {
  sequelize: Sequelize;
  models: ISequelizeModels;
}
