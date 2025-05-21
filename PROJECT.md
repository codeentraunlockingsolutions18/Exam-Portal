
# College Scholarship Exam Portal - Technical Documentation

## Technologies Used

This project is built using the following technologies:

- **Frontend**:
  - React 18 - UI library
  - TypeScript - Type-safe JavaScript
  - Tailwind CSS - Utility-first CSS framework
  - Shadcn UI - Component library built on Radix UI
  - React Router DOM - For routing and navigation
  - Tanstack React Query - Data fetching and state management
  - React Hook Form - Form validation and submission

- **Backend**:
  - Supabase - Backend-as-a-Service platform
  - PostgreSQL - Database for storing application data
  - Supabase Authentication - User authentication and authorization
  - Supabase Storage - File storage (for potential future features)

## Project Structure

```
scholarship-exam-portal/
├── src/                     # Source code
│   ├── components/          # Reusable UI components
│   │   ├── layouts/         # Page layout components
│   │   │   ├── MainLayout.tsx       # Main application layout
│   │   │   ├── AuthLayout.tsx       # Authentication pages layout
│   │   │   ├── ProtectedLayout.tsx  # Layout for authenticated routes
│   │   │   └── AdminLayout.tsx      # Admin-only layout
│   │   ├── ui/              # Shadcn UI components
│   │   └── forms/           # Form components
│   ├── contexts/            # React context providers
│   │   ├── AuthContext.tsx  # Authentication state management
│   │   └── QuizContext.tsx  # Quiz state management
│   ├── pages/               # Application pages
│   │   ├── Index.tsx        # Landing page
│   │   ├── Register.tsx     # Student registration with course selection
│   │   ├── Login.tsx        # Login page
│   │   ├── Dashboard.tsx    # Student dashboard with course-specific quizzes
│   │   ├── QuizDetails.tsx  # Quiz information page
│   │   ├── QuizTaking.tsx   # Quiz examination interface
│   │   ├── QuizResult.tsx   # Results page with scholarship eligibility
│   │   ├── AdminDashboard.tsx  # Admin dashboard
│   │   ├── AdminQuizEdit.tsx   # Quiz management for admins
│   │   └── AdminUserManagement.tsx # User management for admins
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client and types
│   ├── services/            # API service functions
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Static data and mock data
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── App.tsx              # Main application component with routing
├── public/                  # Static assets
└── supabase/                # Supabase configuration
    ├── config.toml          # Supabase configuration
    └── init.sql             # Database initialization script
```

## Database Schema

The application uses the following database tables:

- **courses**: Stores available courses for scholarship exams
- **users**: User accounts including authentication information
- **profiles**: Extended user profile information
- **quizzes**: Scholarship exam details
- **questions**: Questions belonging to quizzes
- **options**: Multiple-choice options for questions
- **submissions**: Completed quiz submissions
- **answers**: Individual question answers within submissions

## Authentication Flow

1. User registers with email, password, and course selection
2. Supabase handles email verification (optional)
3. User logs in with email and password
4. Application maintains session state using AuthContext
5. Protected routes require authentication

## Application Flow

### Student Flow:
1. Register for an account with course selection
2. Log in to access the dashboard
3. View available scholarship exams for their course
4. Take timed multiple-choice exams
5. Receive immediate scores and scholarship eligibility

### Admin Flow:
1. Log in with admin credentials
2. Access the admin dashboard
3. Create and manage quizzes and questions
4. View student submissions and results
5. Manage user accounts

## Development Setup

### Prerequisites
- Node.js v16+
- npm, yarn, or pnpm
- Supabase account

### Environment Variables
The application requires the following environment variables:
- `VITE_SUPABASE_URL`: URL of your Supabase project
- `VITE_SUPABASE_ANON_KEY`: Anon/Public key of your Supabase project

### Running Locally
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open your browser at: `http://localhost:5173`
