
# College Scholarship Exam Portal

A full-stack web application for conducting multiple-choice scholarship exams for college admissions.

## Project Overview

This portal allows students to register for scholarship exams, select their desired course of study, take timed quizzes, and view their scores. Administrators can create and manage quizzes, questions, and review student results.

## Features

- **User Authentication**: Register and login using email and password
- **Course Selection**: Students select their desired course during registration
- **Quiz Interface**: Timed multiple-choice questions with automatic submission
- **Results Dashboard**: Students can view their scores and performance analytics
- **Admin Panel**: Admins can create, edit, and manage exams and questions

## Tech Stack

- **Frontend**: React.js with TypeScript and Tailwind CSS
- **UI Components**: Shadcn UI library
- **State Management**: React Context API
- **Routing**: React Router
- **Data Fetching**: TanStack React Query

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
│   │   ├── Dashboard.tsx   # Student dashboard
│   │   ├── QuizDetails.tsx # Quiz information page
│   │   ├── QuizTaking.tsx  # Quiz examination interface
│   │   ├── QuizResult.tsx  # Results page
│   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   └── AdminQuizEdit.tsx  # Quiz management for admins
│   ├── types/              # TypeScript type definitions
│   ├── hooks/              # Custom React hooks
│   └── App.tsx             # Main application component with routing
└── public/                 # Static assets
```

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

3. Create a `.env` file with the following variables:
   ```
   # Database Connection (if using a backend)
   DATABASE_URL=postgres://username:password@localhost:5432/scholarship_db
   
   # JWT Secret (if using JWT authentication)
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to http://localhost:5173

## Database Setup

### Option 1: Local Database

1. Install PostgreSQL on your machine
2. Create a database named `scholarship_db`
3. Update the `DATABASE_URL` in your `.env` file

### Option 2: Using Supabase (Recommended)

1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Navigate to the SQL editor and run the schema creation script provided below
3. Set up authentication settings in the Supabase dashboard
4. Update the `.env` file with your Supabase credentials

## Database Schema

The database consists of the following tables:

- **users**: Student and admin accounts
- **courses**: Available study programs
- **quizzes**: Scholarship exams
- **questions**: Quiz questions
- **options**: Answer choices for questions
- **submissions**: Student exam attempts
- **answers**: Student-selected answers

## Admin Guide

### How to Add Questions

As an admin, you can manage questions through the admin panel:

1. **Login** as an administrator account
2. Navigate to the **Admin Dashboard** by clicking on the "Admin Dashboard" button
3. Select the **Quizzes** tab to view all available quizzes
4. To create a new quiz:
   - Click the "Create New Quiz" button
   - Fill in the quiz details (title, description, time limit)
   - Click "Create Quiz"
5. To add questions to a quiz:
   - Find the quiz in the list and click "Edit"
   - On the quiz edit page, click "Add Question"
   - Enter the question text
   - Add multiple options (at least 2)
   - Mark one option as correct
   - Click "Add Question" to save
6. You can edit existing questions by clicking on them in the questions list

### Managing Student Results

1. Access the **Admin Dashboard**
2. Navigate to the **Analytics** tab (upcoming feature)
3. View aggregated results by course or by individual quiz
4. Export results to CSV format (upcoming feature)

## Student Guide

### Registration Process

1. Click "Register" on the homepage
2. Fill in your personal details
3. Select your desired course of study from the dropdown menu
4. Create a password
5. Submit your registration

### Taking a Scholarship Exam

1. **Login** to your student account
2. On your dashboard, browse available exams for your selected course
3. Click on an exam to view details
4. Click "Start Quiz" when ready
5. Answer all questions within the time limit
6. Click "Submit Quiz" when finished, or wait for automatic submission when time expires

### Viewing Results

1. After completing an exam, you'll be redirected to the results page
2. View your score, correct answers, and areas for improvement
3. Access previous results from your dashboard under the "My Results" section (upcoming feature)

## Customizing the Homepage

To customize the homepage for your specific college:

1. Modify `src/pages/Index.tsx`:
   - Update the hero section text and images
   - Change color scheme to match college branding
   - Add scholarship program details
   - Update "Features" section to highlight specific benefits

2. Update branding elements in `src/components/Header.tsx` and `src/components/Footer.tsx`:
   - Add college logo
   - Update navigation links
   - Add social media links
   - Include contact information

## Course Management

To add or modify available courses:

1. Update the courses array in the registration page
2. Add course-specific quiz types for each program
3. Customize difficulty levels based on program requirements

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
