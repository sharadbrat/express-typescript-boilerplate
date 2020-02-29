import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';


function getSpec(port: number) {
  const dir = path.dirname(__filename);

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'APP_NAME Open API',
        version: '1.0.0',
        description: 'This is the REST API for APP_NAME app',
      },
      servers: [
        {
          url: `http://localhost:${port}/api/v1`
        }
      ],
      baseUrl: '/api/v1',
    },
    apis: [
      `${dir}/user.yaml`,
    ],
  };

  return swaggerJSDoc(options);
}

export function swagger(port = 3001, serverPort = 3002) {
  const app = express();

  const spec = getSpec(serverPort);
  app.use('/', swaggerUi.serve, swaggerUi.setup(spec, {explorer: true}));

  app.listen(port, () => {
    console.log(`Swagger is running on port ${port}. Check it out: http://localhost:${port}`);
  });
}
