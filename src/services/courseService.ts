
import { Course } from "@/types";
import { courses } from "@/data/courses";  // Use hardcoded courses

export const fetchAllCourses = async (): Promise<Course[]> => {
  try {
    // Return hardcoded courses instead of fetching from Supabase
    return courses;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw error;
  }
};
