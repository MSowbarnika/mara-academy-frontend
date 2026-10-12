import { API } from "../api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/enrollments`)
      .then((response) => response.json())
      .then((data) => {
        setEnrollments(data);
      })
      .catch((error) => {
        console.error("Error loading enrollments:", error);
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
              Enrollments 📋
            </h1>

            <p>
              View student course enrollments.
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
                All Enrollments
              </h2>

              <p>
                {enrollments.length} enrollments
              </p>
            </div>

          </div>

          <div className="my-course-grid">

            {enrollments.map((enrollment) => (

              <div
                className="my-course-card"
                key={enrollment.id}
              >

                <div className="my-course-icon">
                  📋
                </div>

                <div className="my-course-content">

                  <h3>
                    {enrollment.courseName}
                  </h3>

                  <p>
                    <strong>Student ID:</strong>{" "}
                    {enrollment.userId}
                  </p>

                  <p>
                    <strong>Course ID:</strong>{" "}
                    {enrollment.courseId}
                  </p>
                  <p>
                    <strong>Fee:</strong> ₹{enrollment.amount || 0}
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {enrollment.paymentStatus || "-"} (
                    {enrollment.paymentMethod || "-"})
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

export default AdminEnrollments;