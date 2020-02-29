
import { ApplicationModelImpl, ISequelizeDataSource } from '../model';
import { ApplicationServerImpl } from '../server';
import {IApplication, IApplicationInitResult, IApplicationRunResult} from "./ApplicationInterface";
import {IApplicationModel} from "../model/ApplicationModelInterface";
import {IApplicationServer} from "../server/ApplicationServerInterface";
import {IApplicationConfig} from "./ApplicationConfigInterface";

export class ApplicationImpl implements IApplication {

  private model: IApplicationModel<ISequelizeDataSource>;
  private server: IApplicationServer<ISequelizeDataSource>;

  init(config: IApplicationConfig): Promise<IApplicationInitResult> {
    this.model = ApplicationModelImpl.getInstance();

    return this.model.init(config.database)
      .then(() => {
        this.server = ApplicationServerImpl.getInstance();
        return this.server.init(config.http, this.model);
      });
  }

  run(): Promise<IApplicationRunResult> {
    return this.server.run();
  }
}