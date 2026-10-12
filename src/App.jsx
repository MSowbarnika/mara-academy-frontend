import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "./extra.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Demo from "./pages/Demo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Learning from "./pages/Learning";
import Lesson from "./pages/Lesson";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import AdminLessons from "./pages/AdminLessons";
import AdminDemos from "./pages/AdminDemos";
import AdminBulkLessons from "./pages/AdminBulkLessons";
import AdminStudents from "./pages/AdminStudents";
import AdminEnrollments from "./pages/AdminEnrollments";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning/:id" element={<Learning />} />
          <Route path="/learning/:id/lesson/:lessonId" element={<Lesson />} />

          {/* Hidden admin area: open /admin/login directly */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/lessons" element={<AdminLessons />} />
          <Route path="/admin/demos" element={<AdminDemos />} />
          <Route path="/admin/bulk-lessons" element={<AdminBulkLessons />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/enrollments" element={<AdminEnrollments />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
