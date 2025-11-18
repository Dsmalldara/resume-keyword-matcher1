# Resume Keyword Matcher

An intelligent resume optimization platform that analyzes your CV against job descriptions, identifies missing keywords, calculates match scores, and generates customized cover letters—all powered by AI.

## Key Features

- **Resume Upload & Management** - Store multiple resumes with version tracking
- **Job Description Analysis** - Paste job descriptions and get instant analysis
- **Match Score** - Real-time matching percentage with detailed breakdown
- **Keyword Insights** - Discover missing and recommended keywords for better ATS compatibility
- **Cover Letter Generation** - AI-powered cover letters tailored to job descriptions
- **Performance Analytics** - Track resume performance metrics and trends
- **Resume History** - View and compare analysis history

## How It Works

1. Upload your resume (PDF, DOCX, or TXT)
2. Enter a job description or job URL
3. Get instant analysis with match score and gap analysis
4. Review keyword recommendations and insights
5. Generate a customized cover letter with one click
6. Track performance over multiple job applications

![Demo](./demo.gif)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Deno, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage for resume files
- **AI Integration**: LLM-powered analysis and cover letter generation

## Project Structure

```bash
├── frontend/          # Next.js web application
│   └── src/
│       ├── app/       # Pages and layouts
│       ├── components/ # Reusable UI components
│       └── hooks/     # Custom React hooks
├── backend/           # Deno/Express API server
│   └── src/
│       ├── routes/    # API endpoints
│       ├── middleware/ # Auth, rate limiting
│       └── lib/       # Utilities and helpers
└── README.md          # This file
```

## Getting Started

See individual README files:

- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)

---

Beat the ATS, optimize your resume, and land your dream job.
