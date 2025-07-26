
# College Scholarship Exam Portal

A full-stack web application for conducting multiple-choice scholarship exams for college admissions.

## Project Overview

This portal allows students to register for scholarship exams, select their desired course of study, take timed quizzes, and view their scores. Administrators can create and manage quizzes, questions, and review student results.

## Features

- **User Authentication**: Register and login using email and password
- **Course Selection**: Students select their desired course during registration
- **Quiz Interface**: Timed multiple-choice questions with automatic submission
- **Results Dashboard**: Students can view their scores and performance analytics
- **Scholarship Eligibility**: Automatic determination based on score thresholds
- **Admin Panel**: Admins can create, edit, and manage exams and questions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd scholarship-exam-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:5173

## Technical Details

### Database Setup

This application currently uses mock data. For a production environment, you'll need to connect to a database:

#### Option 1: Local Database
- Install PostgreSQL locally
- Create a database named `scholarship_db`
- Update your environment variables with the database connection details

#### Option 2: Using Supabase (Recommended)
1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Use the following schema for your tables:

```sql
-- Create courses table
CREATE TABLE courses (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create users table with course reference
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  course_id VARCHAR(255) REFERENCES courses(id)
);

-- Create quizzes table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  time_limit INTEGER NOT NULL,
  course_id VARCHAR(255) REFERENCES courses(id)
);

-- Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL
);

-- Create options table
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false
);

-- Create submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  quiz_id UUID REFERENCES quizzes(id),
  score INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  selected_option_id UUID REFERENCES options(id)
);
```

3. Update your environment variables with the Supabase connection details

## User Guide

### Student Registration Process

1. Navigate to the registration page
2. Fill in your personal details
3. **Select your desired course of study** from the dropdown menu
4. Create a password
5. Submit your registration

### Taking a Scholarship Exam

1. Log in to your student account
2. On your dashboard, browse available exams for your selected course
3. Click on an exam to view details
4. Click "Start Quiz" when ready
5. Answer all questions within the time limit
6. Click "Submit Quiz" when finished, or wait for automatic submission when time expires

### Viewing Results

After completing an exam, you'll see:
1. Your overall score percentage
2. Number of correct and incorrect answers
3. Time taken to complete the exam
4. **Scholarship eligibility status** - scores of 75% or higher qualify for scholarship consideration

## Admin Guide

### Adding Questions

As an administrator, you can manage quizzes and questions through the admin panel:

1. Log in with admin credentials
2. Navigate to the Admin Dashboard
3. To create a new quiz:
   - Click "Create New Quiz" 
   - Fill in the quiz details (title, description, time limit)
   - Select the course the quiz is for (or "All Courses")
   - Click "Create Quiz"
   
4. To add questions to a quiz:
   - Find the quiz in the list and click "Edit"
   - On the quiz edit page, click "Add Question"
   - Enter the question text
   - Add multiple options (at least 2)
   - Mark one option as correct
   - Click "Add Question" to save

### Managing Quizzes

1. View all quizzes on the Admin Dashboard
2. Filter quizzes by course using the dropdown at the top
3. Edit existing quizzes by clicking the "Edit" button
4. Delete quizzes by clicking the "Delete" button (this will also delete all associated questions)

## Customizing the Project

### Modifying the Homepage

To customize the homepage for your specific college:
1. Update `src/pages/Index.tsx`:
   - Change the hero section text and images
   - Update color scheme to match college branding
   - Add specific scholarship program details

### Adding or Modifying Courses

To change the available courses:
1. Update the courses array in `src/pages/Register.tsx`
2. Update the course selection dropdown in `src/pages/AdminQuizEdit.tsx`

## Project Structure

```
scholarship-exam-portal/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layouts/        # Page layout components
│   │   └── ui/             # Shadcn UI components
│   ├── contexts/           # React context providers
│   │   ├── AuthContext.tsx # Authentication state management
│   │   └── QuizContext.tsx # Quiz state management
│   ├── pages/              # Application pages
│   │   ├── Index.tsx       # Landing page
│   │   ├── Register.tsx    # Student registration with course selection
│   │   ├── Login.tsx       # Login page
│   │   ├── Dashboard.tsx   # Student dashboard with course-specific quizzes
│   │   ├── QuizDetails.tsx # Quiz information page
│   │   ├── QuizTaking.tsx  # Quiz examination interface
│   │   ├── QuizResult.tsx  # Results page with scholarship eligibility
│   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   └── AdminQuizEdit.tsx  # Quiz management for admins
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component with routing
└── public/                 # Static assets
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
