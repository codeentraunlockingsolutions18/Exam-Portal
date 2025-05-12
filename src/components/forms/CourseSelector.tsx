
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courses } from "@/data/courses";

interface CourseSelectorProps {
  selectedCourse: string;
  onSelectCourse: (value: string) => void;
  disabled?: boolean;
}

const CourseSelector = ({ selectedCourse, onSelectCourse, disabled }: CourseSelectorProps) => {
  return (
    <div className="grid gap-2">
      <label htmlFor="course" className="text-sm font-medium">
        Course of Interest
      </label>
      <Select 
        value={selectedCourse}
        onValueChange={onSelectCourse}
        disabled={disabled}
      >
        <SelectTrigger id="course">
          <SelectValue placeholder="Select a course" />
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
