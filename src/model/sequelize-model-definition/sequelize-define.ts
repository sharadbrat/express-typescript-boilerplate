import { Sequelize } from 'sequelize';

import { ISequelizeModels } from '../sequelize-data-source.interface';
import { defineUserModel } from './define-user';

export function sequelizeDefine(sequelize: Sequelize): ISequelizeModels {
  const associateSymbol: symbol = Symbol('associate');

  const models: ISequelizeModels = {
    user: defineUserModel(sequelize, associateSymbol),
  };

  Object.keys(models).forEach(k => {
    models[k][associateSymbol](models);
  });

  return models;
}
