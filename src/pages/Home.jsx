import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../api";
import { BRAND_NAME, PAY_VIDEO_URL, WHATSAPP_NUMBER } from "../config";
import VideoPlayer from "../components/VideoPlayer";
import ContactModal from "../components/ContactModal";
import BannerArt from "../components/BannerArt";
import CoursePhoto from "../components/CoursePhoto";

// Banner slides (change the titles as you like)
const slides = [
  { type: "keyboard", title: "Keyboard Classes" },
  { type: "flute", title: "Flute Classes" },
  { type: "notes", title: "Learn Music Online" },
];

function Home() {
  const [courses, setCourses] = useState([]);
  const [slide, setSlide] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    user = null;
  }

  useEffect(() => {
    fetch(`${API}/api/courses`)
      .then((response) => response.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  // change the banner slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const goPrevious = () =>
    setSlide((current) => (current - 1 + slides.length) % slides.length);

  const goNext = () => setSlide((current) => (current + 1) % slides.length);

  return (
    <div className="home-live">
      {/* BANNER: uses public/banner.webp when the file exists, otherwise the slider */}
      {!bannerFailed ? (
        <div className="home-banner-photo">
          <img
            src="/banner.webp"
            alt={`${BRAND_NAME} banner`}
            onError={() => setBannerFailed(true)}
          />
        </div>
      ) : (
      <div className="home-banner">
        <button
          type="button"
          className="banner-arrow left"
          onClick={goPrevious}
          aria-label="Previous"
        >
          ‹
        </button>

        <div className="banner-slide" key={slide}>
          <div className="banner-circle">
            <BannerArt type={slides[slide].type} />
          </div>
          <h2>{slides[slide].title}</h2>
          <p>{BRAND_NAME}</p>
        </div>

        <button
          type="button"
          className="banner-arrow right"
          onClick={goNext}
          aria-label="Next"
        >
          ›
        </button>
      </div>
      )}

      {/* LOGIN / CONTACT BUTTONS */}
      <div className="home-top-buttons">
        <Link to={user ? "/dashboard" : "/login"} className="yellow-btn">
          Student Login
        </Link>

        <button
          type="button"
          className="yellow-btn"
          onClick={() => setShowContact(true)}
        >
          Contact Info
        </button>
      </div>

      {/* HOW TO PAY THE FEE */}
      <div className="home-block">
        <p className="home-intro">
          Kindly watch the video below. It helps you to see how to pay the fee...
        </p>

        <VideoPlayer url={PAY_VIDEO_URL} />

        <p className="home-notice">
          Hi friends, if you have any issue with Student Login / Register /
          Paying the fee, kindly let us know on WhatsApp number +
          {WHATSAPP_NUMBER} by text or voice message. Thanks.
        </p>
      </div>

      {/* OUR COURSES */}
      <div className="home-block">
        <h2 className="home-heading">Our Courses</h2>

        <div className="home-course-grid">
          {courses.map((course) => (
            <Link
              to={`/course/${course.courseId}`}
              className="home-course-tile"
              key={course.courseId}
            >
              <div className="home-course-image">
                <CoursePhoto course={course} />
              </div>
              <div className="home-course-label">{course.courseName}</div>
            </Link>
          ))}
        </div>

        <div className="home-demo-buttons">
          <Link to="/demo?type=keyboard" className="yellow-btn wide">
            Free Keyboard Demo Classes
          </Link>
          <Link to="/demo?type=flute" className="yellow-btn wide">
            Free Flute Demo Classes
          </Link>
        </div>
      </div>

      <ContactModal open={showContact} onClose={() => setShowContact(false)} />
    </div>
  );
}

export default Home;
