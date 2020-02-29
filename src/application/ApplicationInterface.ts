import { IApplicationConfig } from './ApplicationConfigInterface';

export interface IApplication {
  init(params: IApplicationConfig): Promise<IApplicationInitResult>;

  run(): Promise<IApplicationRunResult>;
}

export enum EApplicationOperationResultStatus {
  SUCCESS,
  ERROR,
}

export interface IApplicationRunResult {
  status: EApplicationOperationResultStatus;
  message: string;
}

export interface IApplicationInitResult {
  status: EApplicationOperationResultStatus;
  message: string;
}
