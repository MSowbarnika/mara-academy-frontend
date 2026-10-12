import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (!storedAdmin) {
      navigate("/admin/login");
      return;
    }

    setAdmin(JSON.parse(storedAdmin));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  if (!admin) {
    return null;
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">

        <div className="dashboard-welcome">
          <div>
            <p className="small-title">
              MARA ACADEMY
            </p>
            <h1>Welcome, Admin 👋</h1>
            <p>{admin.email}</p>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="my-courses-section">
          <div className="dashboard-heading">
            <div>
              <p className="small-title">
                ADMIN PANEL
              </p>
              <h2>Dashboard ⚙️</h2>
              <p>
                Manage your academy from here.
              </p>
            </div>
          </div>

          <div className="my-course-grid">

            <div className="my-course-card">
              <div className="my-course-icon">📚</div>
              <div className="my-course-content">
                <h3>Manage Courses</h3>
                <p>
                  Add, edit and delete academy courses.
                </p>
                <Link
                  to="/admin/courses"
                  className="dashboard-btn"
                >
                  Manage Courses →
                </Link>
              </div>
            </div>

            <div className="my-course-card">
              <div className="my-course-icon">🎥</div>
              <div className="my-course-content">
                <h3>Manage Lessons</h3>
                <p>
                  Manage lessons and learning videos.
                </p>
                <Link
                  to="/admin/lessons"
                  className="dashboard-btn"
                >
                  Manage Lessons →
                </Link>
              </div>
            </div>

            <div className="my-course-card">
              <div className="my-course-icon">👥</div>
              <div className="my-course-content">
                <h3>Students</h3>
                <p>
                  View registered students.
                </p>
                <Link
                  to="/admin/students"
                  className="dashboard-btn"
                >
                  View Students →
                </Link>
              </div>
            </div>

            <div className="my-course-card">
              <div className="my-course-icon">📋</div>
              <div className="my-course-content">
                <h3>Enrollments</h3>
                <p>
                  View students' course enrollments.
                </p>
                <Link
                  to="/admin/enrollments"
                  className="dashboard-btn"
                >
                  View Enrollments →
                </Link>
              </div>
            </div>
            <div className="my-course-card">
              <div className="my-course-icon">🎬</div>
              <div className="my-course-content">
                <h3>Demo Videos</h3>
                <p>
                  Add free Keyboard and Flute demo class videos.
                </p>
                <Link
                  to="/admin/demos"
                  className="dashboard-btn"
                >
                  Manage Demos →
                </Link>
              </div>
            </div>
            <div className="my-course-card">
              <div className="my-course-icon">📼</div>
              <div className="my-course-content">
                <h3>Add Lesson Videos</h3>
                <p>
                  Paste all lesson video links of a course at once.
                </p>
                <Link
                  to="/admin/bulk-lessons"
                  className="dashboard-btn"
                >
                  Add Videos →
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default AdminDashboard;