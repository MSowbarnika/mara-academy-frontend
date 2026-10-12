import { API } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminCourses() {
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    courseName: "",
    description: "",
    level: "",
    totalLessons: 20,
    duration: "",
    fee: 0,
    imageUrl: "",
    sixMonthFee: 0,
    otherFee: 0,
    otherSixMonthFee: 0,
    procedures: "",
    syllabus: "",
  });

  const [editId, setEditId] = useState(null);

  const loadCourses = () => {
    fetch(`${API}/api/courses`)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => {
        console.error("Error loading courses:", error);
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveCourse = async (e) => {
    e.preventDefault();

    const url = editId
      ? `${API}/api/courses/${editId}`
      : `${API}/api/courses`;

    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          totalLessons: Number(form.totalLessons),
          fee: Number(form.fee) || 0,
          sixMonthFee: Number(form.sixMonthFee) || 0,
          otherFee: Number(form.otherFee) || 0,
          otherSixMonthFee: Number(form.otherSixMonthFee) || 0,
        }),
      });

      if (response.ok) {
        alert(
          editId
            ? "Course updated successfully!"
            : "Course added successfully!"
        );

        setForm({
          courseName: "",
          description: "",
          level: "",
          totalLessons: 20,
          duration: "",
    fee: 0,
    imageUrl: "",
    sixMonthFee: 0,
    otherFee: 0,
    otherSixMonthFee: 0,
    procedures: "",
    syllabus: "",
        });

        setEditId(null);
        loadCourses();
      } else {
        alert("Failed to save course.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Cannot connect to server.");
    }
  };

  const editCourse = (course) => {
    setEditId(course.courseId);

    setForm({
      courseName: course.courseName,
      description: course.description,
      level: course.level,
      totalLessons: course.totalLessons,
      duration: course.duration,
      fee: course.fee || 0,
      imageUrl: course.imageUrl || "",
      sixMonthFee: course.sixMonthFee || 0,
      otherFee: course.otherFee || 0,
      otherSixMonthFee: course.otherSixMonthFee || 0,
      procedures: course.procedures || "",
      syllabus: course.syllabus || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteCourse = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/courses/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Course deleted successfully!");
        loadCourses();
      } else {
        alert("Failed to delete course.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Cannot connect to server.");
    }
  };

  const cancelEdit = () => {
    setEditId(null);

    setForm({
      courseName: "",
      description: "",
      level: "",
      totalLessons: 20,
      duration: "",
    fee: 0,
    imageUrl: "",
    sixMonthFee: 0,
    otherFee: 0,
    otherSixMonthFee: 0,
    procedures: "",
    syllabus: "",
    });
  };

  return (
    <section className="dashboard-section">

      <div className="dashboard-container">

        <div className="dashboard-welcome">

          <div>
            <p className="small-title">
              ADMIN PANEL
            </p>

            <h1>
              Manage Courses 📚
            </h1>

            <p>
              Add, edit and delete courses.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="secondary-btn"
          >
            ← Dashboard
          </Link>

        </div>

        {/* ADD / EDIT COURSE */}

        <div className="my-courses-section">

          <div className="dashboard-heading">
            <h2>
              {editId ? "Edit Course ✏️" : "Add New Course ➕"}
            </h2>
          </div>

          <form onSubmit={saveCourse}>

            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              value={form.courseName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="level"
              placeholder="Level"
              value={form.level}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="totalLessons"
              placeholder="Total Lessons"
              value={form.totalLessons}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={form.duration}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="fee"
              placeholder="Fee in Rs (0 = free)"
              value={form.fee}
              onChange={handleChange}
              min="0"
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Course picture link (optional)"
              value={form.imageUrl}
              onChange={handleChange}
            />
            <input
              type="number"
              name="sixMonthFee"
              placeholder="6 month plan fee in Rs (0 = no 6 month plan)"
              value={form.sixMonthFee}
              onChange={handleChange}
              min="0"
            />

            <input
              type="number"
              name="otherFee"
              placeholder="Other country: 4 month fee in Rs (0 = not available)"
              value={form.otherFee}
              onChange={handleChange}
              min="0"
            />

            <input
              type="number"
              name="otherSixMonthFee"
              placeholder="Other country: 6 month fee in Rs (0 = not available)"
              value={form.otherSixMonthFee}
              onChange={handleChange}
              min="0"
            />

            <textarea
              name="procedures"
              className="admin-textarea"
              placeholder="Course procedures (one point per line)"
              value={form.procedures}
              onChange={handleChange}
              rows="5"
            />

            <textarea
              name="syllabus"
              className="admin-textarea"
              placeholder="Course syllabus (one topic per line)"
              value={form.syllabus}
              onChange={handleChange}
              rows="5"
            />

            <button
              type="submit"
              className="primary-btn"
            >
              {editId ? "Update Course" : "Add Course"}
            </button>

            {editId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}

          </form>

        </div>

        {/* ALL COURSES */}

        <div className="my-courses-section">

          <div className="dashboard-heading">

            <div>
              <h2>
                All Courses
              </h2>

              <p>
                {courses.length} courses available
              </p>
            </div>

          </div>

          <div className="my-course-grid">

            {courses.map((course) => (

              <div
                className="my-course-card"
                key={course.courseId}
              >

                <div className="my-course-icon">

                  {course.courseName.includes("Keyboard")
                    ? "🎹"
                    : "🎶"}

                </div>

                <div className="my-course-content">

                  <h3>
                    {course.courseName}
                  </h3>

                  <p>
                    {course.description}
                  </p>

                  <p>
                    <strong>Level:</strong>{" "}
                    {course.level}
                  </p>

                  <p>
                    <strong>Lessons:</strong>{" "}
                    {course.totalLessons}
                  </p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {course.duration}
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => editCourse(course)}
                  >
                    Edit Course ✏️
                  </button>

                  <button
                    className="logout-btn"
                    onClick={() =>
                      deleteCourse(course.courseId)
                    }
                  >
                    Delete Course
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default AdminCourses;