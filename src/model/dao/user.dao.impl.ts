

import { ISequelizeDataSource } from '../sequelize-data-source.interface';
import {IUserDAO} from "./UserDaoInterface";
import {IUserPartialRequestModel, IUserRequestModel, IUserResponseModel, TUserModelId} from "../../entity/UserModel";
import {EntityAlreadyExistsError, EntityByIdNotFoundError, EntityByPropertyNotFoundError} from "../../util";

export class UserDAOImpl implements IUserDAO<ISequelizeDataSource> {

  private static instance: UserDAOImpl;
  private dataSource: ISequelizeDataSource;

  private constructor() {
  }

  static getInstance(): UserDAOImpl {
    if (!this.instance) {
      this.instance = new UserDAOImpl();
    }
    return this.instance;
  }

  init(dataSource: ISequelizeDataSource) {
    this.dataSource = dataSource;
  }

  async addUser(user: IUserRequestModel): Promise<IUserResponseModel> {
    const found = await this.dataSource.models.user.findOne({where: {email: user.email}});
    if (found) {
      throw new EntityAlreadyExistsError('User', 'email', user.email);
    }
    const created = await this.dataSource.models.user.create(user);
    return this.mapUser(created);
  }

  async deleteUser(id: TUserModelId): Promise<IUserResponseModel> {
    const user = await this.dataSource.models.user.findByPk(id);
    if (!user) {
      throw new EntityByIdNotFoundError('User', id);
    }

    user.destroy();
    return this.mapUser(user);
  }

  async getUserById(id: TUserModelId): Promise<IUserResponseModel> {
    const user = await this.dataSource.models.user.findByPk(id);
    if (!user) {
      throw new EntityByIdNotFoundError('User', id);
    }
    return this.mapUser(user);
  }

  async getUserByEmail(email: string): Promise<IUserResponseModel> {
    const user = await this.dataSource.models.user.findOne({where: {email: email}});
    if (!user) {
      throw new EntityByPropertyNotFoundError('User', 'email', email);
    }
    return this.mapUser(user);
  }

  // todo: rethink the method
  async getUsers(offset: number, limit: number): Promise<IUserResponseModel[]> {
    const users = await this.dataSource.models.user.findAll({offset, limit});
    return users.map(el => this.mapUser(el));
  }

  async modifyUser(id: TUserModelId, user: IUserPartialRequestModel): Promise<IUserResponseModel> {
    const foundUser = await this.dataSource.models.user.findByPk(id);
    if (!foundUser) {
      throw new EntityByIdNotFoundError('User', id);
    }

    const noId = {...user, id: undefined};
    foundUser.update(noId);
    return this.mapUser(foundUser)
  }

  private mapUser(res: any): IUserResponseModel {
    return {
      id: res.id,
      email: res.email,
      firstName: res.firstName,
      lastName: res.lastName,
      password: res.password,
      right: res.right,
      type: res.type,
      deletedAt: res.deletedAt,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt
    };
  }

}
