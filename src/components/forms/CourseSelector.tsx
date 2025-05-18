
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Course } from "@/types";
import { Loader2 } from "lucide-react";
import { courses } from "@/data/courses"; // Import hardcoded courses

interface CourseSelectorProps {
  selectedCourse: string;
  onSelectCourse: (value: string) => void;
  disabled?: boolean;
}

const CourseSelector = ({ selectedCourse, onSelectCourse, disabled }: CourseSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
          <SelectValue placeholder="Select a course" />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
        </SelectTrigger>
        <SelectContent>
          {courses.length > 0 ? (
            courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-courses" disabled>
              No courses available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CourseSelector;
