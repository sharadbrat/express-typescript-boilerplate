import {IHTTPConfig} from "../application/ApplicationConfigInterface";
import {IApplicationModel} from "../model/ApplicationModelInterface";
import {IApplicationInitResult, IApplicationRunResult} from "../application/ApplicationInterface";

export interface IApplicationServer<T> {
  init(config: IHTTPConfig, model: IApplicationModel<T>): Promise<IApplicationInitResult>;

  run(): Promise<IApplicationRunResult>;
}
