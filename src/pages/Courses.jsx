import CourseImage from "../components/CourseImage";
import { API } from "../api";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/courses`)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  return (
    <section className="courses-section">
      <div className="section-heading">
        <p>OUR COURSES</p>

        <h2>Learn Music With Us</h2>

        <span>
          Choose a course and start your musical journey.
        </span>
      </div>

      <div className="course-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.courseId}>

            <CourseImage course={course} />

            <h3>{course.courseName}</h3>

            <p>{course.description}</p>
            <p className="course-fee">
              {course.fee > 0 ? `₹${course.fee}` : "Free"}
            </p>

            <Link
              to={`/course/${course.courseId}`}
              className="course-btn"
            >
              View Course →
            </Link>

          </div>
        ))}
      </div>
    </section>
  );
}

export default Courses;