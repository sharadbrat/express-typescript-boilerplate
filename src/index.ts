// Inline sourcemaps
import 'source-map-support/register'

import { swagger } from './swagger';

import { APPLICATION_CONFIG } from './application.config';
import { ApplicationImpl } from './application';
import { ConfigurationService } from './server/service';
import {
  EApplicationOperationResultStatus,
  IApplicationInitResult,
  IApplicationRunResult
} from "./application/ApplicationInterface";

export function expressApplication() {
  const app = new ApplicationImpl();

  const configurationService = ConfigurationService.getInstance();
  configurationService.setConfiguration(APPLICATION_CONFIG);

  app.init(configurationService.getConfig()).then((initResult: IApplicationInitResult) => {
    if (initResult.status === EApplicationOperationResultStatus.SUCCESS) {
      console.log(`[APP_NAME]: Application is successfully initialized`);

      app.run().then((runResult: IApplicationRunResult) => {
        if (runResult.status === EApplicationOperationResultStatus.SUCCESS) {
          console.log(`[APP_NAME]: Application is running on port ${APPLICATION_CONFIG.http.port}`);
          console.log(`[APP_NAME]: Message: ${runResult.message}`);

          if (process.env.NODE_ENV === 'development') {
            swagger(3002, 3001);
          }
        }
      });
    }
  });
}
