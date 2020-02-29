import { DataTypes, Sequelize } from 'sequelize';

import { ISequelizeModels, TSequelizeModel } from '../sequelize-data-source.interface';
import {USER_RIGHT_VALUES, USER_TYPE_VALUES} from "../../entity/UserModel";

export function defineUserModel(sequelize: Sequelize, associateSymbol: symbol): TSequelizeModel {
  const user = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    password: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 32]
      },
    },
    firstName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: [2, 64]
      },
    },
    lastName: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: [2, 64]
      },
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: USER_TYPE_VALUES,
    },
    right: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: USER_RIGHT_VALUES,
    },
  }, {
    paranoid: true,
  });
  user[associateSymbol] = (models: ISequelizeModels) => {
    // associations go here
  };

  return user as TSequelizeModel;
}
