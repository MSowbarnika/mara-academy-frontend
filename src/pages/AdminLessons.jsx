import { API } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminLessons() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [lessons, setLessons] = useState([]);

  const [form, setForm] = useState({
    lessonTitle: "",
    videoUrl: "",
    lessonNumber: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/courses`)
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);

        if (data.length > 0) {
          setSelectedCourse(data[0].courseId);
        }
      })
      .catch((error) => {
        console.error("Error loading courses:", error);
      });
  }, []);

  const loadLessons = () => {
    if (!selectedCourse) {
      return;
    }

    fetch(
      `${API}/api/lessons/course/${selectedCourse}`
    )
      .then((response) => response.json())
      .then((data) => {
        setLessons(data);
      })
      .catch((error) => {
        console.error("Error loading lessons:", error);
      });
  };

  useEffect(() => {
    loadLessons();
  }, [selectedCourse]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveLesson = async (e) => {
    e.preventDefault();

    const url = editId
      ? `${API}/api/lessons/${editId}`
      : `${API}/api/lessons`;

    const method = editId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: Number(selectedCourse),
          lessonTitle: form.lessonTitle,
          videoUrl: form.videoUrl,
          lessonNumber: Number(form.lessonNumber),
        }),
      });

      if (response.ok) {
        alert(
          editId
            ? "Lesson updated successfully!"
            : "Lesson added successfully!"
        );

        setForm({
          lessonTitle: "",
          videoUrl: "",
          lessonNumber: "",
        });

        setEditId(null);

        loadLessons();
      } else {
        alert("Failed to save lesson.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Cannot connect to server.");
    }
  };

  const editLesson = (lesson) => {
    setEditId(lesson.lessonId);

    setForm({
      lessonTitle: lesson.lessonTitle,
      videoUrl: lesson.videoUrl,
      lessonNumber: lesson.lessonNumber,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditId(null);

    setForm({
      lessonTitle: "",
      videoUrl: "",
      lessonNumber: "",
    });
  };

  const deleteLesson = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/lessons/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Lesson deleted successfully!");
        loadLessons();
      } else {
        alert("Failed to delete lesson.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Cannot connect to server.");
    }
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
              Manage Lessons 🎥
            </h1>

            <p>
              Add, edit and delete lessons.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="secondary-btn"
          >
            ← Dashboard
          </Link>

        </div>

        {/* SELECT COURSE */}

        <div className="my-courses-section">

          <h2>
            Select Course
          </h2>

          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setEditId(null);

              setForm({
                lessonTitle: "",
                videoUrl: "",
                lessonNumber: "",
              });
            }}
          >
            {courses.map((course) => (
              <option
                key={course.courseId}
                value={course.courseId}
              >
                {course.courseName}
              </option>
            ))}
          </select>

        </div>

        {/* ADD / EDIT LESSON */}

        <div className="my-courses-section">

          <div className="dashboard-heading">

            <h2>
              {editId
                ? "Edit Lesson ✏️"
                : "Add New Lesson ➕"}
            </h2>

          </div>

          <form onSubmit={saveLesson}>

            <input
              type="number"
              name="lessonNumber"
              placeholder="Lesson Number"
              value={form.lessonNumber}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lessonTitle"
              placeholder="Lesson Title"
              value={form.lessonTitle}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="videoUrl"
              placeholder="Video URL"
              value={form.videoUrl}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="primary-btn"
            >
              {editId
                ? "Update Lesson"
                : "Add Lesson"}
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

        {/* LESSON LIST */}

        <div className="my-courses-section">

          <h2>
            Lessons
          </h2>

          <p>
            {lessons.length} lessons available
          </p>

          <div className="my-course-grid">

            {lessons.map((lesson) => (

              <div
                className="my-course-card"
                key={lesson.lessonId}
              >

                <div className="my-course-icon">
                  🎥
                </div>

                <div className="my-course-content">

                  <h3>
                    Lesson {lesson.lessonNumber}
                  </h3>

                  <p>
                    {lesson.lessonTitle}
                  </p>

                  <p>
                    <strong>Video:</strong>{" "}
                    {lesson.videoUrl}
                  </p>

                  <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>

                  <button
                 className="primary-btn"
                 onClick={() => editLesson(lesson)}
                 >
                  Edit Lesson ✏️
                  </button>

                <button
  type="button"
  onClick={() => deleteLesson(lesson.lessonId)}
  style={{
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    display: "inline-block",
    width: "auto",
    minWidth: "130px"
  }}
>
  Delete Lesson 🗑️
</button>
                 </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default AdminLessons;