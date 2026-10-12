import { useState } from "react";

// Shows the course picture (image link saved in the course), otherwise an icon.
// If the image file is missing, the icon is shown instead of a broken picture.
function CourseImage({ course }) {
  const [failed, setFailed] = useState(false);

  if (course.imageUrl && course.imageUrl.trim() && !failed) {
    return (
      <img
        src={course.imageUrl}
        alt={course.courseName}
        className="course-photo"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="course-icon">
      {course.courseName.includes("Flute") ? "🎶" : "🎹"}
    </div>
  );
}

export default CourseImage;
