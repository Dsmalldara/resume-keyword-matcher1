import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Resume Analysis API',
      version: '1.0.0',
      description:
        'Backend API for AI-powered resume analysis. Matches CVs against job descriptions, identifies missing keywords, calculates compatibility scores, and generates personalized cover letter suggestions. Built with Node.js/Express.',
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
      // ✅ Security scheme (do NOT nest this under another components)
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Supabase JWT token',
        },
      },

      // ✅ Schemas
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'An unexpected error occurred',
            },
            details: {
              type: 'string',
              nullable: true,
              description: 'Additional information about the error',
              example: 'Please try again later',
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
                  msg: { type: 'string', example: 'Invalid resumeId' },
                  param: { type: 'string', example: 'resumeId' },
                  location: { type: 'string', example: 'body' },
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string', nullable: true },
            bio: { type: 'string', nullable: true },
            avatarUrl: { type: 'string', nullable: true },
            username: { type: 'string', nullable: true },
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
              example: 3600,
            },
          },
        },
        Resume: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            storageKey: { type: 'string' },
            profileId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            fileUrl: { type: 'string' },
            fileSize: { type: 'integer' },
            version: { type: 'integer' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ActivityLog: {
          type: 'object',
          required: [
            'id',
            'entityId',
            'entityType',
            'message',
            'type',
            'createdAt',
            'profileId',
          ],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the activity log',
              example: 'clx123abc456',
            },
            entityId: {
              type: 'string',
              description: 'ID of the entity this activity relates to',
              example: 'resume-123',
            },
            entityType: {
              type: 'string',
              description: 'Type of entity (resume, job, profile)',
              example: 'resume',
            },
            message: {
              type: 'string',
              description: 'Human-readable activity message',
              example: 'Senior_Developer_Resume.pdf uploaded',
            },
            type: { $ref: '#/components/schemas/ActivityType' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when activity occurred',
              example: '2024-10-31T10:30:00Z',
            },
            metadata: {
              type: 'object',
              nullable: true,
              description: 'Additional data stored as JSON',
              additionalProperties: true,
              example: {
                filename: 'Senior_Developer_Resume.pdf',
                version: 1,
                fileSize: 245760,
                matchScore: 92,
              },
            },
            profileId: {
              type: 'string',
              format: 'uuid',
              description: 'Profile this activity belongs to',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
        ActivityType: {
          type: 'string',
          enum: [
            'RESUME_UPLOADED',
            'RESUME_DELETED',
            'JOB_MATCHED',
            'JOB_APPLIED',
            'PROFILE_UPDATED',
          ],
          description: 'Available activity types in the system',
          example: 'RESUME_UPLOADED',
        },
        JobDescription: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'Senior Software Engineer' },
            company: { type: 'string', example: 'OpenAI' },
            description: {
              type: 'string',
              description: 'Full job description text',
            },
            confidenceScore: {
              type: 'number',
              nullable: true,
              example: 0.94,
            },
            profileId: { type: 'string', format: 'uuid' },
          },
        },
        AnalysisResult: {
          type: 'object',
          properties: {
            matchScore: {
              type: 'number',
              example: 87.5,
              description:
                'Overall compatibility score between resume and job',
            },
            summary: {
              type: 'string',
              description: 'Concise summary of the analysis findings',
              example:
                'The resume aligns strongly with backend development requirements.',
            },
            strengths: {
              type: 'array',
              items: { type: 'string' },
              example: [
                'Proficient in TypeScript',
                'Strong backend experience',
                'Cloud deployment expertise',
              ],
            },
            gaps: {
              type: 'array',
              items: { type: 'string' },
              example: ['Limited experience with CI/CD', 'No mention of Docker'],
            },
            nextSteps: {
              type: 'array',
              items: { type: 'string' },
              example: [
                'Add Docker experience to resume',
                'Highlight cloud certifications',
              ],
            },
          },
        },
        AnalysisResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: {
              type: 'string',
              example: 'Analysis completed successfully',
            },
            data: {
              type: 'object',
              allOf: [
                {
                  type: 'object',
                  properties: {
                    analysisId: {
                      type: 'string',
                      format: 'uuid',
                      example: '0de78c61-f3f2-4c23-85f7-9201a4c6ef5b',
                    },
                    jobDescriptionId: {
                      type: 'string',
                      format: 'uuid',
                      example: 'b43a23b2-c0e3-4f92-b8a3-ef202f2b7c6d',
                    },
                  },
                },
                { $ref: '#/components/schemas/AnalysisResult' },
              ],
            },
          },
        },
        AnalysisErrorDetails: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Unable to validate job description at this time',
            },
            details: {
              type: 'string',
              example: 'Please try again later',
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
  apis: [
    './src/routes/*.ts',
    './src/routes/auth/routes/*.ts',
      './src/routes/coverletters/routes/*.ts',
    './src/routes/resumes/*.ts',
    './src/routes/analysis/routes/*.ts',
    './src/routes/insights/routes/*.ts', 
    './src/routes/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
