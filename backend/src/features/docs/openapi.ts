export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Xavier API',
    version: '1.0.0',
    description: 'API de backend do projeto Xavier.',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local' },
    { url: '/', description: 'Mesmo host (Vercel)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
        },
        required: ['status'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          expiresAt: { type: 'string', format: 'date-time' },
        },
        required: ['token', 'expiresAt'],
      },
      MeResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
        },
        required: ['id', 'email'],
      },
      ProductListResponse: {
        type: 'object',
        properties: {
          items: { type: 'array', items: { type: 'object' } },
          totalCount: { type: 'integer' },
          page: { type: 'integer' },
          pageSize: { type: 'integer' },
        },
      },
      ProductDetailResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          shortDescription: { type: 'string' },
          longDescription: { type: 'string' },
          medias: { type: 'array', items: { type: 'object' } },
          tags: { type: 'array', items: { type: 'object' } },
          affiliateLinks: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' },
              },
            },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login admin e emissão de JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token emitido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '400': { description: 'Validation failed' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Dados do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Usuário autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MeResponse' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Lista produtos com filtros',
        parameters: [
          { in: 'query', name: 'search', schema: { type: 'string' } },
          { in: 'query', name: 'tags', schema: { type: 'string' }, description: 'CSV de IDs de tags' },
          { in: 'query', name: 'sort', schema: { type: 'string', enum: ['recent', 'name_asc', 'name_desc'] } },
          { in: 'query', name: 'page', schema: { type: 'integer', minimum: 1 } },
          { in: 'query', name: 'pageSize', schema: { type: 'integer', minimum: 1, maximum: 50 } },
        ],
        responses: {
          '200': {
            description: 'Lista paginada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductListResponse' },
              },
            },
          },
          '400': { description: 'Validation failed' },
        },
      },
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Detalhe de produto por ID',
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': {
            description: 'Produto',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductDetailResponse' },
              },
            },
          },
          '404': { description: 'Not found' },
          '400': { description: 'Validation failed' },
        },
      },
    },
    '/api/tags': {
      get: {
        tags: ['Tags'],
        summary: 'Lista tags',
        responses: {
          '200': {
            description: 'Tags',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [{ name: 'Health' }, { name: 'Auth' }, { name: 'Products' }, { name: 'Tags' }],
} as const;
