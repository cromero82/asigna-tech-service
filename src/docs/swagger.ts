import { Express, RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openapiDocument } from './openapi';

const swaggerUiHandler = swaggerUi.setup(openapiDocument, {
  customSiteTitle: 'Asigna Tech API',
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui textarea.body-param__text {
      max-height: 14rem !important;
      overflow: auto !important;
    }
    .swagger-ui .curl-command {
      max-height: 10rem !important;
      overflow: auto !important;
    }
    .swagger-ui .highlight-code {
      max-height: 20rem !important;
      overflow: auto !important;
    }
    .swagger-ui .live-responses-table {
      scroll-margin-top: 1.5rem;
    }
  `,
  customJsStr: `
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest || !target.closest('.execute')) {
        return;
      }
      window.setTimeout(function () {
        var tabla = document.querySelector('.live-responses-table');
        if (tabla) {
          tabla.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
    }, true);
  `,
  swaggerOptions: {
    displayRequestDuration: true,
    tryItOutEnabled: true,
    filter: true,
    docExpansion: 'list',
    deepLinking: false,
    validatorUrl: null,
    url: null
  }
}) as RequestHandler;

const swaggerStatic = swaggerUi.serve as unknown as RequestHandler[];

export function registrarSwagger(app: Express): void {
  app.get('/v3/api-docs', (_req, res) => {
    res.json(openapiDocument);
  });
  app.use('/swagger-ui', ...swaggerStatic, swaggerUiHandler);
}
