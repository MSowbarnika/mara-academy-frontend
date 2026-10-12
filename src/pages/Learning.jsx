import { API } from "../api";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Learning() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const courseResponse = await fetch(
          `${API}/api/courses/${id}`
        );

        const lessonsResponse = await fetch(
          `${API}/api/lessons/course/${id}`
        );

        if (!courseResponse.ok || !lessonsResponse.ok) {
          throw new Error("Data not found");
        }

        const courseData = await courseResponse.json();
        const lessonsData = await lessonsResponse.json();

        setCourse(courseData);
        setLessons(lessonsData);
        setLoading(false);

      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <section className="learning-section">
        <div className="learning-container">
          <h1>Loading Course...</h1>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="learning-section">
        <div className="learning-container">
          <h1>Course Not Found</h1>

          <Link to="/dashboard">
            ← Back to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="learning-section">

      <div className="learning-container">

        <div className="learning-header">

          <div className="learning-icon">
            {course.courseName.includes("Keyboard")
              ? "🎹"
              : "🎶"}
          </div>

          <div>
            <p className="small-title">
              MY COURSE
            </p>

            <h1>
              {course.courseName}
            </h1>

            <p>
              Learn step by step with our online lessons.
            </p>
          </div>

        </div>

        {/* LESSONS */}

        <div className="lesson-list-card">

          <h2>
            Course Lessons
          </h2>

          <p className="lesson-count">
            {lessons.length} lessons
          </p>

          <div className="lessons">

            {lessons.map((lesson) => (

              <Link
                key={lesson.lessonId}
                to={`/learning/${id}/lesson/${lesson.lessonNumber}`}
                style={{
                  textDecoration: "none",
                  color: "inherit"
                }}
              >

                <div
                  className="lesson-item"
                  style={{
                    cursor: "pointer"
                  }}
                >

                  <div className="lesson-number">
                    {lesson.lessonNumber}
                  </div>

                  <div className="lesson-info">

                    <h3>
                      {lesson.lessonTitle}
                    </h3>

                    <span>
                      🎥 Video Lesson
                    </span>

                  </div>

                  <span className="lesson-arrow">
                    →
                  </span>

                </div>

              </Link>

            ))}

          </div>

        </div>

        <Link
          to="/dashboard"
          className="back-dashboard"
        >
          ← Back to Dashboard
        </Link>

      </div>

    </section>
  );
}

export default Learning;