import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";

// Paste all lesson video links of a course at once (line 1 = Lesson 1, line 2 = Lesson 2 ...)
// Each line can be:   link        or        Title | link
function AdminBulkLessons() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [lessons, setLessons] = useState([]);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login");
      return;
    }

    fetch(`${API}/api/courses`)
      .then((response) => response.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCourses(list);
        if (list.length > 0) {
          setCourseId(String(list[0].courseId));
        }
      })
      .catch(() => setError("Cannot load courses."));
  }, [navigate]);

  const loadLessons = (id) => {
    if (!id) {
      return;
    }

    fetch(`${API}/api/lessons/course/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const list = Array.isArray(data) ? [...data] : [];
        list.sort((a, b) => a.lessonNumber - b.lessonNumber);
        setLessons(list);
      })
      .catch(() => setError("Cannot load lessons."));
  };

  useEffect(() => {
    loadLessons(courseId);
  }, [courseId]);

  const handleSave = async () => {
    setMessage("");
    setError("");

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setError("Please paste at least one link.");
      return;
    }

    setSaving(true);

    try {
      for (let i = 0; i < lines.length; i++) {
        const parts = lines[i].split("|");
        const hasTitle = parts.length > 1;

        const title = hasTitle ? parts[0].trim() : "";
        const url = (hasTitle ? parts.slice(1).join("|") : parts[0]).trim();

        const existing = lessons[i];

        const body = existing
          ? {
              ...existing,
              lessonTitle: title || existing.lessonTitle,
              videoUrl: url,
            }
          : {
              courseId: Number(courseId),
              lessonTitle: title || `Lesson ${i + 1}`,
              videoUrl: url,
              lessonNumber: i + 1,
            };

        const response = await fetch(
          existing
            ? `${API}/api/lessons/${existing.lessonId}`
            : `${API}/api/lessons`,
          {
            method: existing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          throw new Error(`Lesson ${i + 1}: ${await response.text()}`);
        }
      }

      setMessage(`Saved ${lines.length} lessons ✅`);
      setText("");
      loadLessons(courseId);
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <div>
            <p className="small-title">ADMIN PANEL</p>
            <h1>Add Lesson Videos 🎬</h1>
            <p>
              Paste the YouTube links of a course, one link per line. Line 1 is
              Lesson 1, line 2 is Lesson 2, and so on.
            </p>
          </div>
          <Link to="/admin/dashboard" className="logout-btn">
            ← Dashboard
          </Link>
        </div>

        <div className="bulk-box">
          <select
            className="bulk-select"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>

          <textarea
            className="bulk-textarea"
            rows="12"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              "https://youtu.be/xxxxxxxxxxx\n" +
              "https://youtu.be/yyyyyyyyyyy\n\n" +
              "You can also give a title with the link:\n" +
              "Introduction | https://youtu.be/xxxxxxxxxxx"
            }
          />

          <button
            type="button"
            className="primary-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Lesson Videos"}
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>

        <h2 className="bulk-heading">Current lessons ({lessons.length})</h2>

        <div className="admin-demo-list">
          {lessons.map((lesson) => (
            <div className="admin-demo-row" key={lesson.lessonId}>
              <div>
                <strong>
                  Lesson {lesson.lessonNumber}: {lesson.lessonTitle}
                </strong>
                <p>{lesson.videoUrl ? lesson.videoUrl : "No video yet"}</p>
              </div>
              <span>{lesson.videoUrl ? "✅" : "⬜"}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminBulkLessons;
