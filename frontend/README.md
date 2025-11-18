# Frontend Application

Next.js web application for Resume Keyword Matcher. Provides a user-friendly interface for resume upload, job analysis, and cover letter generation.

## Technology Stack

- Next.js 15 - React framework with App Router
- React 19 - UI library
- TypeScript - Type-safe development
- Tailwind CSS - Styling framework
- Shadcn/UI - Component library (Radix UI primitives)
- React Query - State management and caching
- Axios - HTTP client
- React Hook Form - Form management with Zod validation
- Recharts - Data visualization

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (user)/             # Protected routes (dashboard)
│   │   │   ├── Home/           # Home/dashboard page
│   │   │   ├── resumes/        # Resume management
│   │   │   ├── analysis/       # Resume analysis results
│   │   │   ├── cover-letters/  # Cover letter management
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   └── page.tsx        # Root dashboard page
│   │   │
│   │   ├── auth/               # Authentication pages
│   │   │   └── [...slug]/      # Auth routes (login, signup, etc.)
│   │   │
│   │   ├── layout.tsx          # Root layout
│   │   ├── providers.tsx       # Global providers (React Query, Themes)
│   │   ├── jobProvider.tsx     # Job data context provider
│   │   ├── globals.css         # Global styles
│   │   └── middleware.ts       # Authentication middleware
│   │
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Shadcn/UI components
│   │   ├── app-sidebar.tsx     # Navigation sidebar
│   │   ├── jobDescriptionDialog.tsx     # Job description modal
│   │   ├── SelectResume.tsx    # Resume selection dropdown
│   │   ├── SelectAnalysis.tsx  # Analysis selection dropdown
│   │   ├── StatusBadge.tsx     # Status indicator
│   │   ├── DeleteAlertDialog.tsx        # Delete confirmation
│   │   ├── ResumeExistsDialog.tsx       # Resume conflict dialog
│   │   └── ConfirmAlertDialog.tsx       # Generic confirmation
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useResumeCount.ts   # Fetch resume count
│   │   └── use-mobile.ts       # Mobile detection
│   │
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts            # General utilities and query keys
│   │   ├── helper.ts           # Helper functions
│   │   ├── date-utils.ts       # Date formatting
│   │   └── generate-metadata.ts # SEO metadata generation
│   │
│   ├── api/                    # API client configuration
│   │   ├── client.ts           # Axios instance with interceptors
│   │   ├── generated/          # Auto-generated API types from Orval
│   │   └── models/             # TypeScript types and interfaces
│   │
│   ├── supabaseClient.ts       # Supabase client setup
│   └── middleware.ts           # Next.js middleware for auth
│
├── public/                     # Static assets
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── orval.config.ts             # API client generation config
└── package.json
```

## Key Features

- Resume management with version tracking
- Job description analysis
- Real-time match scoring
- Keyword recommendations
- Cover letter draft generation
- Activity tracking
- User authentication
- Responsive design

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm run dev
```

The application runs on http://localhost:3000

### Build and Production

Build the application:

```bash
pnpm run build
```

Start production server:

```bash
pnpm run start
```

## Available Scripts

- `pnpm generate:api` - Generate API client types from OpenAPI spec


### Authentication Flow

- Users authenticate via Supabase Auth (email/password or OAuth)
- JWT token stored in cookies and localStorage
- Middleware protects routes requiring authentication
- Token automatically refreshed via interceptor


### State Management

- React Query handles server state caching
- Context API for global state (JobProvider for job data)
- Local component state with React hooks
- Form state with React Hook Form

## Components

### Page Components

- **Home** - Dashboard with analytics and quick actions
- **Resumes** - Resume CRUD operations with pagination
- **Analysis** - View resume-to-job analysis results
- **Cover Letters** - Generate and manage cover letters

### Shared Components

- **Sidebar** - Main navigation
- **Dialogs** - Job description, delete confirmation, resume selection
- **StatusBadge** - Visual status indicators
- **SelectResume/SelectAnalysis** - Dropdown selectors

### UI Components (Shadcn)

- Buttons, forms, dialogs, cards, tables, pagination, tabs, etc.

## API Integration

The frontend uses Orval to auto-generate type-safe API client from backend OpenAPI spec.

### Generate API Client

```bash
pnpm generate:api
```

Generates TypeScript types and React Query hooks in `src/api/generated/`

### API Client Usage

## Routing

### Public Routes

- `/auth/login` - Login page
- `/auth/signup` - Registration page
- `/auth/forgot-password` - Password reset request
- `/auth/reset-password` - Password reset confirmation

### Protected Routes (User Dashboard)

- `/` - Home/dashboard
- `/resumes` - Resume management
- `/analysis` - Analysis results
- `/cover-letters` - Cover letter management

## Configuration

### Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```


## Forms

React Hook Form with Zod validation for type-safe form handling.

## Error Handling

- API errors caught and displayed via toast notifications
- Validation errors shown at field level
- Fallback UI for loading and error states

## Middleware

- `middleware.ts` - Authentication check and route protection
- API client interceptors - Token refresh and error handling

## Testing

Configure Jest and React Testing Library as needed. Test command available via npm scripts.

## Development Workflow

1. Create feature branch
2. Run `pnpm run dev` for development
3. Use ESLint before committing: `pnpm run lint`
4. Generate updated API types if backend changes: `pnpm generate:api`
5. Build locally to check for issues: `pnpm run build`
