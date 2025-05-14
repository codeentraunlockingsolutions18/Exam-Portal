
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types";
import { Loader2 } from "lucide-react";

interface CourseSelectorProps {
  selectedCourse: string;
  onSelectCourse: (value: string) => void;
  disabled?: boolean;
}

const CourseSelector = ({ selectedCourse, onSelectCourse, disabled }: CourseSelectorProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching courses from Supabase...");
        const { data, error } = await supabase
          .from('courses')
          .select('id, name');
        
        if (error) {
          console.error('Error fetching courses:', error);
          setError(`Failed to load courses: ${error.message}`);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('Courses fetched successfully:', data);
          setCourses(data.map(course => ({
            id: course.id,
            name: course.name
          })));
        } else {
          console.warn('No courses found in the database');
          setError("No courses found in the database");
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="grid gap-2">
      <label htmlFor="course" className="text-sm font-medium">
        Course of Interest
      </label>
      <Select 
        value={selectedCourse}
        onValueChange={onSelectCourse}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id="course" className="w-full">
          <SelectValue placeholder={isLoading ? "Loading courses..." : "Select a course"} />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading courses...
            </SelectItem>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-courses" disabled>
              {error || "No courses available"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CourseSelector;
