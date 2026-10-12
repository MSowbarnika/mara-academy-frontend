import { friendlyError } from "../utils/errors";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../api";

const PAYMENT_METHODS = [
  { id: "UPI", label: "UPI (GPay / PhonePe)", icon: "📱" },
  { id: "CARD", label: "Debit / Credit Card", icon: "💳" },
  { id: "NETBANKING", label: "Net Banking", icon: "🏦" },
];

// "line1\nline2" -> ["line1", "line2"]
function toLines(text) {
  return (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

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

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [enrolling, setEnrolling] = useState(false);

  // Fetch course from Spring Boot
  useEffect(() => {
    fetch(`${API}/api/courses/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Course not found");
        }
        return response.json();
      })
      .then((data) => {
        setCourse(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching course:", err);
        setError("Unable to load course.");
        setLoading(false);
      });
  }, [id]);

  // Find this student's enrollment for the course (if any)
  useEffect(() => {
    const checkEnrollment = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return;
      }

      const user = JSON.parse(storedUser);

      try {
        const response = await fetch(`${API}/api/enrollments/user/${user.id}`);

        if (response.ok) {
          const enrollments = await response.json();
          const found = enrollments.find(
            (item) => Number(item.courseId) === Number(id)
          );
          setEnrollment(found || null);
        }
      } catch (err) {
        console.log("Enrollment check failed");
      }
    };

    checkEnrollment();
  }, [id]);

  if (loading) {
    return (
      <section className="course-details">
        <h1>Loading Course...</h1>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="course-details">
        <h1>Course Not Found</h1>
        <Link to="/courses" className="course-btn">
          Back to Courses
        </Link>
      </section>
    );
  }

  // 4 and 6 month plans, each with an India fee and an Other Country fee
  const plans = [];

  [4, 6].forEach((months) => {
    const india = Number(months === 4 ? course.fee : course.sixMonthFee) || 0;
    const other =
      Number(months === 4 ? course.otherFee : course.otherSixMonthFee) || 0;

    const options = [];

    if (india > 0 || months === 4) {
      options.push({ region: "INDIA", label: "Fees in India", fee: india });
    }

    if (other > 0) {
      options.push({
        region: "OTHER",
        label: "Fees in Other Country",
        fee: other,
      });
    }

    if (options.length > 0) {
      plans.push({ months, options });
    }
  });

  const enrolled = enrollment !== null;
  const expired = enrolled && isExpired(enrollment.validUntil);
  const canBuy = !enrolled || expired;

  const procedures = toLines(course.procedures);
  const syllabus = toLines(course.syllabus);

  // Send the enrollment (and demo payment) to Spring Boot
  const completeEnrollment = async (plan) => {
    setMessage("");
    setError("");
    setEnrolling(true);

    try {
      const response = await fetch(`${API}/api/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: Number(id),
          courseName: course.courseName,
          validityMonths: plan.months,
          region: plan.region,
          paymentMethod: plan.fee > 0 ? paymentMethod : "FREE",
        }),
      });

      const data = await response.text();

      if (response.ok) {
        setMessage(
          plan.fee > 0
            ? "Payment successful (demo). You are enrolled! 🎉"
            : "Course enrolled successfully! 🎉"
        );
        setSelectedPlan(null);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else if (response.status === 401 || response.status === 403) {
        // old or expired login: ask the student to login again
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError(friendlyError(data, "Enrollment failed."));
      }
    } catch (err) {
      setError("Cannot connect to the server. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  const handlePayClick = (plan) => {
    setMessage("");
    setError("");

    if (!localStorage.getItem("user")) {
      navigate("/login");
      return;
    }

    if (plan.fee > 0) {
      setSelectedPlan(plan);
    } else {
      completeEnrollment(plan);
    }
  };

  return (
    <section className="course-live">
      <div className="live-banner">
        <h1>{course.courseName}</h1>
      </div>

      <div className="live-home">
        <Link to="/" aria-label="Home">
          🏠
        </Link>
      </div>

      <div className="live-body">
        {error && <p className="error-message">{error}</p>}

        {message && <p className="success-message">{message}</p>}

        {enrolled && !expired && (
          <div className="enrolled-box">
            <p className="success-message">
              ✅ You are enrolled
              {enrollment.validUntil
                ? `. Valid until ${formatDate(enrollment.validUntil)}`
                : ""}
            </p>
            <button
              className="live-pay"
              onClick={() => navigate(`/learning/${id}`)}
            >
              Continue Learning →
            </button>
          </div>
        )}

        {expired && (
          <p className="error-message">
            Your plan ended on {formatDate(enrollment.validUntil)}. Choose a
            plan below to renew.
          </p>
        )}

        {canBuy &&
          plans.map((plan) => (
            <div className="live-plan" key={plan.months}>
              <h2 className="live-validity">{plan.months} Month Validity</h2>

              {plan.options.map((option) => (
                <div key={option.region}>
                  <div className="live-fee">
                    {option.fee > 0 ? `${option.label} ₹${option.fee}` : "Free"}
                  </div>
                  <button
                    className={
                      option.region === "OTHER" ? "live-pay green" : "live-pay"
                    }
                    onClick={() =>
                      handlePayClick({
                        months: plan.months,
                        region: option.region,
                        fee: option.fee,
                      })
                    }
                    disabled={enrolling}
                  >
                    {option.fee > 0 ? "Pay" : "Enroll Free"}
                  </button>
                </div>
              ))}
            </div>
          ))}

        {canBuy && selectedPlan && (
          <div className="modal-overlay" onClick={() => setSelectedPlan(null)}>
            <div
              className="modal-box pay-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                Pay ₹{selectedPlan.fee} for {selectedPlan.months} months
                {selectedPlan.region === "OTHER" ? " (Other Country)" : ""}
              </h3>
              <p className="payment-note">
                Demo payment only. No real money is taken.
              </p>

              <div className="payment-options">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={
                      paymentMethod === method.id
                        ? "payment-option selected"
                        : "payment-option"
                    }
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <span>
                      {method.icon} {method.label}
                    </span>
                  </label>
                ))}
              </div>

              {error && <p className="error-message">{error}</p>}

              <button
                className="primary-btn pay-confirm"
                onClick={() => completeEnrollment(selectedPlan)}
                disabled={enrolling}
              >
                {enrolling
                  ? "Processing..."
                  : `Pay ₹${selectedPlan.fee} & Enroll`}
              </button>

              <button
                type="button"
                className="secondary-btn modal-close"
                onClick={() => setSelectedPlan(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {procedures.length > 0 && (
          <>
            <h2 className="live-heading">Course Procedures:</h2>
            <ul className="live-list">
              {procedures.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </>
        )}

        {syllabus.length > 0 && (
          <>
            <h2 className="live-heading">Course Syllabus:</h2>
            <ul className="live-list">
              {syllabus.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </>
        )}

        <div className="live-actions">
          <Link
            to={
              course.courseName.includes("Flute")
                ? "/demo?type=flute"
                : "/demo?type=keyboard"
            }
            className="yellow-btn wide"
          >
            Free Demo Classes
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CourseDetails;
