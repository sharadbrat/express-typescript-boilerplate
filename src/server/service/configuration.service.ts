import {IApplicationConfig} from "../../application/ApplicationConfigInterface";

export class ConfigurationService {
  private static instance: ConfigurationService;

  private config: IApplicationConfig;

  private constructor() {
  }


  public static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  public setConfiguration(config: IApplicationConfig) {
    this.config = config;
  }

  public getConfig(): IApplicationConfig {
    return this.config;
  }
}
