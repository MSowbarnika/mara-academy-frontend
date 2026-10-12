import { useState } from "react";

// Course picture for the home page tiles.
// If the image link is empty or the file is missing, an icon is shown instead.
function CoursePhoto({ course }) {
  const [failed, setFailed] = useState(false);

  const hasImage = course.imageUrl && course.imageUrl.trim() && !failed;

  if (hasImage) {
    return (
      <img
        src={course.imageUrl}
        alt={course.courseName}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className="photo-fallback">
      {course.courseName.includes("Flute") ? "🎶" : "🎹"}
    </span>
  );
}

export default CoursePhoto;
