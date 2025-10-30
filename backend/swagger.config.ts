import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Resume Analysis API',
      version: '1.0.0',
      description: 'Backend API for AI-powered resume analysis. Matches CVs against job descriptions, identifies missing keywords, calculates compatibility scores, and generates personalized cover letter suggestions. Built with Node.js/Express.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
      {
        url: 'https://api.production.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Supabase JWT token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  param: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
              nullable: true,
            },
            bio: {
              type: 'string',
              nullable: true,
            },
            avatarUrl: {
              type: 'string',
              nullable: true,
            },
            username: {
              type: 'string',
              nullable: true,
            },
          },
        },
        Session: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              description: 'JWT access token',
            },
            refresh_token: {
              type: 'string',
              description: 'JWT refresh token',
            },
            expires_in: {
              type: 'integer',
              description: 'Token expiration time in seconds',
            },
          },
        },
        Resume: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            storageKey: {
              type: 'string',
            },
            profileId: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            fileUrl: {
              type: 'string',
            },
            fileSize: {
              type: 'integer',
            },
            version: {
              type: 'integer',
            },
            isActive: {
              type: 'boolean',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/*.js'], // Path to your route files
};

export const swaggerSpec = swaggerJsdoc(options);