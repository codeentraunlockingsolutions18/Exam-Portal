
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types";

export const fetchAllCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name')
      .order('name');
    
    if (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('No courses found');
      return [];
    }
    
    return data.map(course => ({
      id: course.id,
      name: course.name
    }));
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    throw error;
  }
};
