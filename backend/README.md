# Backend API Server

The backend server for Resume Keyword Matcher built with Express.js, TypeScript, and PostgreSQL. Handles resume processing, AI-powered analysis, authentication, and activity tracking.

## Technology Stack

- Express.js - HTTP server framework
- TypeScript - Type-safe development
- PostgreSQL - Database with Prisma ORM
- Supabase - Authentication and file storage
- Winston - Structured logging
- Groq & Google Gemini - AI model integration

## Project Structure

```
backend/
├── src/
│   ├── lib/                    # Core integrations
│   │   ├── ai.ts              # AI model configuration
│   │   ├── prisma.ts          # Database client
│   │   └── supabase.ts        # Storage and auth client
│   │
│   ├── middleware/            # Express middleware
│   │   ├── auth.ts            # JWT authentication
│   │   ├── rateLimiter.ts     # Request rate limiting
│   │   └── requestId.ts       # Request tracking
│   │
│   ├── routes/                # API route handlers
│   │   ├── auth/              # Authentication endpoints
│   │   ├── resumes/           # Resume CRUD operations
│   │   ├── analysis/          # Resume analysis
│   │   ├── insights/          # User insights and analytics
│   │   ├── coverletters/      # Cover letter generation
│   │   ├── activity/          # Activity logging
│   │   └── debug.routes.ts    # Debug utilities
│   │
│   ├── validations/           # Input validation schemas
│   │
│   └── server.ts              # Express app setup
│
├── supabase/                  # Supabase Edge Functions
│   ├── functions/
│   │   └── process-resume/    # Resume content extraction and parsing
│   │       ├── index.ts       # Main function logic
│   │       └── deno.json      # Deno dependencies
│   │
│   └── _shared/               # Shared utilities for Supabase functions
│       ├── pdf-extractor.ts   # PDF text extraction
│       ├── extractDocxText.ts # DOCX text extraction
│       └── extractTxtText.ts  # Plain text handling
│
├── prisma/
│   ├── schema.prisma          # Database models
│   └── migrations/            # Migration history
│
├── utils/
│   ├── logger.ts              # Winston logger
│   ├── activityLogger.ts      # Activity tracking
│   └── createProfile.ts       # User profile helpers
│
├── swagger.config.ts          # API documentation
├── package.json
├── tsconfig.json
└── deno.json
```

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Database Setup

Create and apply migrations:

```bash
pnpm migrate:dev
```

### Development

Start the development server:

```bash
pnpm dev
```

The server runs on http://localhost:4000

### Production

Build and run:

```bash
pnpm build
pnpm start:prod
```

## Available Scripts

- `pnpm dev` - Development server with hot reload
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Run production build
- `pnpm start:prod` - Run with production environment
- `pnpm migrate:dev` - Create and apply database migrations
- `pnpm migrate:deploy:prod` - Deploy migrations to production
- `pnpm migrate:reset:dev` - Reset database (development only)
- `pnpm prisma:generate:prod` - Generate Prisma client
- `pnpm lint` - Run ESLint
- `pnpm test` - Run test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm delete:user` - Delete user and associated data

## Database Migrations

The schema uses Prisma ORM with PostgreSQL. Models include:

- Profile - User accounts and metadata
- Resume - Uploaded documents with version history
- ResumeContent - Extracted and parsed content
- JobDescription - Job postings for analysis
- Analysis - Resume-to-job comparison results
- CoverLetter - Generated cover letters
- ActivityLog - User activity tracking
- UsageQuota - Subscription tier limits

## Middleware

- **Auth** - Supabase JWT token validation
- **Rate Limiting** - Prevents abuse on auth endpoints
- **Request ID** - Tracks requests through logs
- **CORS** - Cross-origin request handling
- **Helmet** - Security headers
- **Logging** - Request/response tracking

## Routes

### Authentication
- `/auth/signup` - Register account
- `/auth/login` - Login
- `/auth/logout` - Logout
- `/auth/refresh` - Refresh JWT token
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Complete password reset
- `/auth/google` - Google OAuth
- `/auth/callback` - OAuth callback

### Resume Management
- `/resume/upload/presign` - Get presigned upload URL
- `/resume/upload/complete` - Record upload completion and resume validation
- `/resume/upload/finalize` - Create resume record 
- `/resume/list` - List user resumes
- `/resume/:id` - Delete resume

### Analysis
- `/analysis/analyze` - Analyze resume vs job description
- `/analysis/list` - List analyses
- `/analysis/trend` - Trend data

### Insights
- `/insights/improvement` - Average improvement metrics
- `/insights/best-match` - Best match score
- `/insights/jobs-analyzed` - Total jobs analyzed

### Cover Letters
- `/coverletters/generate` - Generate cover letter
- `/coverletters/list` - List cover letters
- `/coverletters/:id` - Delete cover letter

### Activity
- `/activity/recent` - Get recent activity logs

## Supabase Edge Functions

The backend uses Supabase Edge Functions (Deno-based) for serverless text extraction and resume parsing. These functions are triggered automatically when resume files are uploaded.

### process-resume Function

Located in `supabase/functions/process-resume/`

Triggered when a resume file is uploaded to Supabase Storage. The function:

1. Downloads the file from storage (PDF, DOCX, TXT, or RTF)
2. Extracts text using appropriate parser based on file type
3. Sends extracted text to Google Gemini AI for parsing
4. Stores parsed resume content in database with structured data (name, email, phone, skills, experience, education, certifications, projects)
5. Updates resume status from PENDING to PROCESSED

Supported file types:
- PDF
- DOCX (Microsoft Word)
- DOC (Microsoft Word legacy)
- TXT (Plain text)
- RTF (Rich Text Format)

### Shared Utilities

The `supabase/_shared/` folder contains reusable functions for text extraction:

- `pdf-extractor.ts` - Extracts text from PDF files using pdf-parse
- `extractDocxText.ts` - Extracts text from DOCX files using mammoth
- `extractTxtText.ts` - Handles plain text files

## Resume Upload Flow

1. Client requests presigned URL via `/resume/upload/presign`
2. Client uploads file directly to Supabase Storage using presigned URL
3. Client notifies backend via `/resume/upload/complete`
4. Client finalizes via `/resume/upload/finalize` which creates database record
5. Supabase Storage webhook triggers `process-resume` Edge Function
6. Function extracts text and parses resume content
7. ResumeContent record is created with parsed data
8. Resume status updates to PROCESSED

## API Documentation

Full API documentation is available at `/api-docs` when the server is running.

- Swagger UI: `http://localhost:4000/api-docs`
- OpenAPI JSON: `http://localhost:4000/api-docs.json`
- Health check: `http://localhost:4000/health`

## Configuration

Set environment variables in `.env.development.local` or `.env.production`. See `.env.example` for required variables.

## Logging

Logs are stored in the `/logs` directory with daily rotation:

- `error-*.log` - Error level logs
- `warn-*.log` - Warning level logs
- `combined-*.log` - All logs

Logs are retained for 14 days and output to console during development.

## Security

- JWT authentication with Supabase
- Rate limiting on authentication endpoints
- CORS with configurable origins
- Helmet.js for security headers
- Input validation with express-validator
- SQL injection prevention via Prisma ORM
- Secure cookie handling
