// Lesson progress is saved per student, so another student who logs in on the
// same browser never sees the previous student's progress.
export function progressKey(courseId) {
  let userId = "guest";

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user && user.id) {
      userId = user.id;
    }
  } catch (error) {
    userId = "guest";
  }

  return `completedLessons-${userId}-${courseId}`;
}
