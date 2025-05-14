
import { supabase } from "@/integrations/supabase/client";
import { Course, Quiz, Question, Option, User } from "@/types";

// User Services
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: authData } = await supabase.auth.getUser();
  
  if (!authData.user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, courses:course_id(name)')
    .eq('id', authData.user.id)
    .single();
  
  if (!profile) return null;
  
  return {
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    role: profile.role as 'user' | 'admin',
    courseId: profile.course_id || undefined,
    courseName: profile.courses?.name || undefined
  };
};

export const promoteUserToAdmin = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);
  
  return !error;
};

// Course Services
export const getAllCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('name');
  
  if (error) throw error;
  
  return data.map(course => ({
    id: course.id,
    name: course.name
  }));
};

export const createCourse = async (course: { name: string }): Promise<Course> => {
  const id = Math.random().toString(36).substring(2, 9); // Simple ID generation
  const { data, error } = await supabase
    .from('courses')
    .insert([{ id, name: course.name }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    name: data.name
  };
};

// Quiz Services
export const getQuizzesByCourse = async (courseId: string): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      questions:questions(count)
    `)
    .eq('course_id', courseId);
  
  if (error) throw error;
  
  return data.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description || '',
    timeLimit: quiz.time_limit,
    questionCount: quiz.questions?.length || 0,
    courseId: quiz.course_id
  }));
};

export const getQuizById = async (quizId: string): Promise<Quiz | null> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      questions:questions(count)
    `)
    .eq('id', quizId)
    .single();
  
  if (error) return null;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    timeLimit: data.time_limit,
    questionCount: data.questions?.length || 0,
    courseId: data.course_id
  };
};

export const createQuiz = async (quiz: Omit<Quiz, 'id' | 'questionCount'>): Promise<Quiz> => {
  const { data, error } = await supabase
    .from('quizzes')
    .insert([{
      title: quiz.title,
      description: quiz.description,
      time_limit: quiz.timeLimit,
      course_id: quiz.courseId
    }])
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    timeLimit: data.time_limit,
    questionCount: 0,
    courseId: data.course_id
  };
};

export const updateQuiz = async (quiz: Omit<Quiz, 'questionCount'>): Promise<Quiz> => {
  const { data, error } = await supabase
    .from('quizzes')
    .update({
      title: quiz.title,
      description: quiz.description,
      time_limit: quiz.timeLimit,
      course_id: quiz.courseId
    })
    .eq('id', quiz.id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    timeLimit: data.time_limit,
    questionCount: 0, // We don't have this info from the update operation
    courseId: data.course_id
  };
};

// Question Services
export const getQuestionsByQuizId = async (quizId: string): Promise<Question[]> => {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      options(*)
    `)
    .eq('quiz_id', quizId);
  
  if (error) throw error;
  
  return data.map(question => ({
    id: question.id,
    quizId: question.quiz_id,
    questionText: question.question_text,
    options: question.options.map((option: any) => ({
      id: option.id,
      questionId: option.question_id,
      text: option.option_text,
      isCorrect: option.is_correct
    }))
  }));
};

export const createQuestion = async (
  question: Omit<Question, 'id'> & { options: Omit<Option, 'id' | 'questionId'>[] }
): Promise<Question> => {
  // Insert question first
  const { data: questionData, error: questionError } = await supabase
    .from('questions')
    .insert({
      quiz_id: question.quizId,
      question_text: question.questionText
    })
    .select()
    .single();
  
  if (questionError) throw questionError;
  
  // Then insert all options
  const optionsToInsert = question.options.map(option => ({
    question_id: questionData.id,
    option_text: option.text,
    is_correct: option.isCorrect || false
  }));
  
  const { data: optionsData, error: optionsError } = await supabase
    .from('options')
    .insert(optionsToInsert)
    .select();
  
  if (optionsError) throw optionsError;
  
  return {
    id: questionData.id,
    quizId: questionData.quiz_id,
    questionText: questionData.question_text,
    options: optionsData.map(option => ({
      id: option.id,
      questionId: option.question_id,
      text: option.option_text,
      isCorrect: option.is_correct
    }))
  };
};

export const updateQuestion = async (
  question: Question
): Promise<Question> => {
  // Update question text
  const { error: questionError } = await supabase
    .from('questions')
    .update({
      question_text: question.questionText
    })
    .eq('id', question.id);
  
  if (questionError) throw questionError;
  
  // Update each option
  for (const option of question.options) {
    const { error: optionError } = await supabase
      .from('options')
      .update({
        option_text: option.text,
        is_correct: option.isCorrect || false
      })
      .eq('id', option.id);
    
    if (optionError) throw optionError;
  }
  
  return question;
};

// Submission Services
export const submitQuiz = async (
  quizId: string, 
  userId: string,
  score: number,
  answers: { questionId: string; selectedOptionId: string }[]
): Promise<string> => {
  // Insert submission
  const { data: submissionData, error: submissionError } = await supabase
    .from('submissions')
    .insert({
      quiz_id: quizId,
      user_id: userId,
      score: score
    })
    .select()
    .single();
  
  if (submissionError) throw submissionError;
  
  // Insert answers
  const answersToInsert = answers.map(answer => ({
    submission_id: submissionData.id,
    question_id: answer.questionId,
    selected_option_id: answer.selectedOptionId
  }));
  
  const { error: answersError } = await supabase
    .from('answers')
    .insert(answersToInsert);
  
  if (answersError) throw answersError;
  
  return submissionData.id;
};

export const getSubmissionsByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('submissions')
    .select(`
      *,
      quiz:quiz_id(title, time_limit)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  
  return data;
};
