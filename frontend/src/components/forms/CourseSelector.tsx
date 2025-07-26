import React from "react";
import { useCourses } from "@/data/courses";

export interface Course {
  name: string;
  id: string;
}

interface CourseSelectorProps {
  selectedCourse: string;
  onSelectCourse: (name: string) => void;
  disabled?: boolean;
}

const CourseSelector = ({
  selectedCourse,
  onSelectCourse,
  disabled,
}: CourseSelectorProps) => {
  const { courses, loading, error } = useCourses();

  return (
    <div className="grid gap-2">
      <label htmlFor="course" className="text-sm font-medium">
        Select Course
      </label>
      <select
        id="course"
        value={selectedCourse}
        onChange={(e) => onSelectCourse(e.target.value)}
        disabled={disabled || loading}
        className="border rounded p-2"
        required
      >
        <option value="">-- Select --</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
           
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default CourseSelector;
