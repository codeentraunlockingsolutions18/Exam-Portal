
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Course } from "@/types";

interface CourseSelectorProps {
  selectedCourse: string;
  onSelectCourse: (value: string) => void;
  disabled?: boolean;
}

const CourseSelector = ({ selectedCourse, onSelectCourse, disabled }: CourseSelectorProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }

        setCourses(data.map(course => ({
          id: course.id,
          name: course.name
        })));
      } catch (error) {
        console.error('Error fetching courses:', error);
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
        <SelectTrigger id="course">
          <SelectValue placeholder={isLoading ? "Loading courses..." : "Select a course"} />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CourseSelector;
