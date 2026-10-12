import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../api";
import VideoPlayer from "../components/VideoPlayer";

function Lesson() {
  const { id, lessonId } = useParams();

  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLesson() {
      try {
        const courseResponse = await fetch(`${API}/api/courses/${id}`);
        const lessonsResponse = await fetch(`${API}/api/lessons/course/${id}`);

        if (!courseResponse.ok || !lessonsResponse.ok) {
          throw new Error("Data not found");
        }

        const courseData = await courseResponse.json();
        const lessonsData = await lessonsResponse.json();

        const currentLesson = lessonsData.find(
          (item) => Number(item.lessonNumber) === Number(lessonId)
        );

        setCourse(courseData);
        setLessons(lessonsData);
        setLesson(currentLesson);
        setLoading(false);
      } catch (error) {
        console.error("Error loading lesson:", error);
        setLoading(false);
      }
    }

    loadLesson();
  }, [id, lessonId]);

  if (loading) {
    return (
      <section className="learning-section">
        <div className="learning-container">
          <h1>Loading Lesson...</h1>
        </div>
      </section>
    );
  }

  if (!course || !lesson) {
    return (
      <section className="learning-section">
        <div className="learning-container">
          <h1>Lesson Not Found</h1>
          <Link to={`/learning/${id}`}>← Back to Lessons</Link>
        </div>
      </section>
    );
  }

  const currentNumber = Number(lesson.lessonNumber);
  const totalLessons = lessons.length;

  // Video comes from the lesson itself (YouTube link or video file path),
  // which the admin sets in Admin > Lessons.
  const videoUrl = lesson.videoUrl;

  const previousNumber = currentNumber > 1 ? currentNumber - 1 : null;
  const nextNumber = currentNumber < totalLessons ? currentNumber + 1 : null;

  // Save "lesson finished" in the database (works on any phone or laptop)
  const markLessonComplete = () => {
    fetch(`${API}/api/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: Number(id),
        lessonNumber: currentNumber,
      }),
    }).catch(() => {});
  };

  return (
    <section className="learning-section">
      <div className="learning-container">
        <p className="small-title">{course.courseName}</p>

        <p>
          Lesson {currentNumber} of {totalLessons}
        </p>

        <h1>{lesson.lessonTitle}</h1>

        <div className="lesson-video-card">
          <VideoPlayer url={videoUrl} onEnded={markLessonComplete} />
        </div>

        <div className="lesson-content">
          <h2>{lesson.lessonTitle}</h2>
          <p>
            Watch this lesson carefully and practice along with your teacher.
          </p>
        </div>

        <div
          className="lesson-navigation"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          {previousNumber ? (
            <Link
              to={`/learning/${id}/lesson/${previousNumber}`}
              className="secondary-btn"
            >
              ← Previous Lesson
            </Link>
          ) : (
            <span></span>
          )}

          {nextNumber ? (
            <Link
              to={`/learning/${id}/lesson/${nextNumber}`}
              className="primary-btn"
              onClick={markLessonComplete}
            >
              Next Lesson →
            </Link>
          ) : (
            <Link
              to={`/learning/${id}`}
              className="primary-btn"
              onClick={markLessonComplete}
            >
              Complete Course ✓
            </Link>
          )}
        </div>

        <br />

        <Link to={`/learning/${id}`} className="back-dashboard">
          ← Back to Lessons
        </Link>
      </div>
    </section>
  );
}

export default Lesson;
