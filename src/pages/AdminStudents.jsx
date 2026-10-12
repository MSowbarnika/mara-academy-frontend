import { API } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/users`)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Error loading students:", error);
      });
  }, []);

  return (
    <section className="dashboard-section">

      <div className="dashboard-container">

        <div className="dashboard-welcome">

          <div>
            <p className="small-title">
              ADMIN PANEL
            </p>

            <h1>
              Students 👥
            </h1>

            <p>
              View registered students.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="secondary-btn"
          >
            ← Dashboard
          </Link>

        </div>

        <div className="my-courses-section">

          <div className="dashboard-heading">

            <div>
              <h2>
                Registered Students
              </h2>

              <p>
                {students.length} students registered
              </p>
            </div>

          </div>

          <div className="my-course-grid">

            {students.map((student) => (

              <div
                className="my-course-card"
                key={student.id}
              >

                <div className="my-course-icon">
                  👤
                </div>

                <div className="my-course-content">

                  <h3>
                    {student.name}
                  </h3>

                  <p>
                    <strong>Email:</strong>{" "}
                    {student.email}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default AdminStudents;