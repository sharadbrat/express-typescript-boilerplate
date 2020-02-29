import { IDAO } from './DaoInterface';
import { IUserPartialRequestModel, IUserRequestModel, IUserResponseModel, TUserModelId } from '../../entity';

export interface IUserDAO<T> extends IDAO<T> {
  addUser(user: IUserRequestModel): Promise<IUserResponseModel>;

  getUsers(offset: number, limit: number): Promise<IUserResponseModel[]>;

  getUserById(id: TUserModelId): Promise<IUserResponseModel>;

  modifyUser(id: TUserModelId, user: IUserPartialRequestModel): Promise<IUserResponseModel>;

  deleteUser(id: TUserModelId): Promise<IUserResponseModel>;

  getUserByEmail(email: string): Promise<IUserResponseModel>;
}
