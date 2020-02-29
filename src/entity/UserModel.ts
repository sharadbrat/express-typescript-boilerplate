import { IModel } from './Model';

export type TUserModelId = string;

export const USER_RIGHT_VALUES = [
  'SUPERUSER',
  'OWNER',
  'ADMINISTRATOR',
  'MODERATOR',
  'OBSERVER',
];

export const SUB_USER_RIGHT_VALUES = [
  'ADMINISTRATOR',
  'MODERATOR',
  'OBSERVER',
];

export const USER_TYPE_VALUES = [
  'INDIVIDUAL',
  'COMPANY',
];

export enum EUserRight {
  SUPERUSER = 'SUPERUSER',
  OWNER = 'OWNER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  MODERATOR = 'MODERATOR',
  OBSERVER = 'OBSERVER'
}

export enum EUserType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY',
}

export interface IUserResponseModel extends IUserRequestModel, IModel<TUserModelId> {
  boss?: IUserResponseModel;
}

export interface IUserRequestModel extends IUserCredentials {
  firstName: string;
  lastName: string;
  right?: EUserRight;
  type: EUserType;
}

export interface IUserCredentials {
  password: string;
  email: string;
}

export interface IUserPartialRequestModel extends Partial<IUserRequestModel> {
}
