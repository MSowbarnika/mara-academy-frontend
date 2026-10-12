import { API } from "../api";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


function formatDate(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return isNaN(date)
    ? value
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function isExpired(value) {
  if (!value) {
    return false;
  }
  const end = new Date(value);
  end.setHours(23, 59, 59, 999);
  return end < new Date();
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [progressList, setProgressList] = useState([]);

  // Profile Edit
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Change Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // LOAD USER + COURSES
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    let loggedInUser;

    try {
      loggedInUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (!loggedInUser?.id) {
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    // finished lessons of this student (saved in the database)
    fetch(`${API}/api/progress/user/${loggedInUser.id}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setProgressList(Array.isArray(data) ? data : []))
      .catch(() => {});

    // all courses (shown when the student has not purchased any course)
    fetch(`${API}/api/courses`)
      .then((response) => response.json())
      .then((data) => setAllCourses(Array.isArray(data) ? data : []))
      .catch(() => {});

    setUser(loggedInUser);

    setProfile({
      name: loggedInUser.name || "",
      email: loggedInUser.email || "",
      phone: loggedInUser.phone || "",
    });

    fetch(
      `${API}/api/enrollments/user/${loggedInUser.id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load courses");
        }
        return response.json();
      })
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error loading courses:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // PROFILE CHANGE
  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // UPDATE PROFILE
  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    if (!profile.name.trim() || !profile.email.trim() || !profile.phone.trim()) {
      setProfileError("Please fill all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(profile.phone)) {
      setProfileError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profile.name.trim(),
            email: profile.email.trim(),
            phone: profile.phone.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Profile update failed.");
      }

      const updatedUser = await response.json();

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setProfile({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      });

      setProfileMessage("Profile updated successfully! 🎉");
      setEditing(false);
    } catch (error) {
      setProfileError(
        error.message || "Cannot connect to server."
      );
    }
  };

  // PASSWORD INPUT CHANGE
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // CHANGE PASSWORD
  const handleChangePassword = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Please fill all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (
      passwordData.currentPassword ===
      passwordData.newPassword
    ) {
      setPasswordError(
        "New password must be different from current password."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/users/${user.id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.text();

      if (!response.ok) {
        setPasswordError(data || "Password change failed.");
        return;
      }

      setPasswordMessage("Password changed successfully! 🎉");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(
        "Cannot connect to server. Please make sure Spring Boot is running."
      );
    }
  };

  // USER LOADING
  if (!user) {
    return null;
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">

        {/* WELCOME */}
        <div className="live-welcome">
          <span>Welcome ! {user.name}</span>

          <button
            type="button"
            className="live-signout"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>

        {/* MY COURSES */}
        <div className="my-courses-section">
          <div className="dashboard-heading">
            <div>
              <p className="small-title">
                LEARNING
              </p>

              <h2>
                Your Class Packages:
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="empty-course-box">
              <p>Loading your courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-course-box">
              <div className="empty-icon">
                📚
              </div>

              <h3 className="empty-big-red">
                You have not purchased a course. You should purchase a course
                for e-learning.
              </h3>

              <p className="empty-big-blue">Courses are given below</p>

              <div className="empty-course-buttons">
                {allCourses.map((item) => (
                  <Link
                    key={item.courseId}
                    to={`/course/${item.courseId}`}
                    className="dashboard-btn"
                  >
                    {item.courseName}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="my-course-grid">
              {courses.map((course) => {
                const totalLessons = 20;

                const doneLessons = progressList
                  .filter(
                    (item) => Number(item.courseId) === Number(course.courseId)
                  )
                  .map((item) => Number(item.lessonNumber));

                const completedCount = Math.min(
                  new Set(doneLessons).size,
                  totalLessons
                );

                // continue from the lesson after the last finished one
                const resumeLesson =
                  doneLessons.length > 0
                    ? Math.min(Math.max(...doneLessons) + 1, totalLessons)
                    : 1;

                const progress = Math.round(
                  (completedCount / totalLessons) * 100
                );

                const expired = isExpired(course.validUntil);

                return (
                  <div
                    className="my-course-card"
                    key={course.id}
                  >
                    <div className="my-course-icon">
                      {course.courseId === 3
                        ? "🎶"
                        : "🎹"}
                    </div>

                    <div className="my-course-content">
                      <span className="course-status">
                        {expired ? "EXPIRED" : "ENROLLED"}
                      </span>

                      <h3>{course.courseName}</h3>

                      <p className="package-info">
                        {course.validityMonths
                          ? `${course.validityMonths} month plan`
                          : "Course plan"}
                        {course.amount > 0 ? ` • Paid ₹${course.amount}` : ""}
                      </p>

                      {course.validUntil && (
                        <p
                          className={
                            expired
                              ? "package-info expired-text"
                              : "package-info"
                          }
                        >
                          {expired ? "Expired on " : "Valid until "}
                          {formatDate(course.validUntil)}
                        </p>
                      )}

                      {/* PROGRESS */}
                      <div className="dashboard-progress">
                        <div className="dashboard-progress-top">
                          <span>Course Progress</span>

                          <strong>{progress}%</strong>
                        </div>

                        <div className="dashboard-progress-bar">
                          <div
                            className="dashboard-progress-fill"
                            style={{
                              width: `${progress}%`,
                            }}
                          ></div>
                        </div>

                        <p>
                          {completedCount} / {totalLessons} lessons completed
                        </p>
                      </div>

                      {expired ? (
                        <Link
                          to={`/course/${course.courseId}`}
                          className="dashboard-btn"
                        >
                          Renew Plan →
                        </Link>
                      ) : (
                        <Link
                          to={`/learning/${course.courseId}/lesson/${resumeLesson}`}
                          className="dashboard-btn"
                        >
                          {completedCount > 0
                            ? "Continue Learning →"
                            : "Start Learning →"}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MY PROFILE */}
        <div className="profile-section">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              👤
            </div>

            <h3>My Profile</h3>

            {!editing ? (
              <>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone || "Not added"}</p>

                {profileMessage && (
                  <p className="success-message">
                    {profileMessage}
                  </p>
                )}

                <button
                  className="dashboard-btn"
                  onClick={() => {
                    setEditing(true);
                    setProfileMessage("");
                    setProfileError("");
                  }}
                >
                  ✏️ Edit Profile
                </button>
              </>
            ) : (
              <form
                onSubmit={handleUpdateProfile}
                className="profile-form"
              >
                <div className="form-group">
                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    maxLength="10"
                  />
                </div>

                {profileError && (
                  <p className="error-message">
                    {profileError}
                  </p>
                )}

                {profileMessage && (
                  <p className="success-message">
                    {profileMessage}
                  </p>
                )}

                <div className="profile-buttons">
                  <button
                    type="submit"
                    className="dashboard-btn"
                  >
                    💾 Save Changes
                  </button>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => {
                      setEditing(false);
                      setProfileError("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="profile-section">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">
              🔐
            </div>

            <h3>Change Password</h3>

            <p>
              Update your account password securely.
            </p>

            <form
              onSubmit={handleChangePassword}
              className="profile-form"
            >
              <div className="form-group">
                <label>Current Password</label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label>New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
              </div>

              {passwordError && (
                <p className="error-message">
                  {passwordError}
                </p>
              )}

              {passwordMessage && (
                <p className="success-message">
                  {passwordMessage}
                </p>
              )}

              <button
                type="submit"
                className="dashboard-btn"
              >
                🔐 Change Password
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Dashboard;