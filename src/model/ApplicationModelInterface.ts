import { IDatabaseConfig } from '../application';
import { IUserDAO } from './dao/UserDaoInterface';

export interface IApplicationModel<T> {
  init(config: IDatabaseConfig): Promise<T>;

  getDataSource(): T;

  getUserDAO(): IUserDAO<T>;

}
