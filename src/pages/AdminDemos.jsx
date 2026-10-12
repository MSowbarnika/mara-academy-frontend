import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api";

const emptyForm = {
  category: "KEYBOARD",
  title: "",
  videoUrl: "",
  sortOrder: 1,
};

function AdminDemos() {
  const navigate = useNavigate();

  const [demos, setDemos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const loadDemos = () => {
    fetch(`${API}/api/demos`)
      .then((response) => response.json())
      .then((data) => setDemos(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error loading demos:", err));
  };

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      navigate("/admin/login");
      return;
    }
    loadDemos();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveDemo = async (e) => {
    e.preventDefault();
    setError("");

    const url = editId ? `${API}/api/demos/${editId}` : `${API}/api/demos`;

    try {
      const response = await fetch(url, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sortOrder: Number(form.sortOrder) || 0,
        }),
      });

      if (response.ok) {
        setForm(emptyForm);
        setEditId(null);
        loadDemos();
      } else {
        setError((await response.text()) || "Failed to save demo video.");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    }
  };

  const editDemo = (demo) => {
    setEditId(demo.id);
    setForm({
      category: demo.category,
      title: demo.title,
      videoUrl: demo.videoUrl,
      sortOrder: demo.sortOrder,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDemo = async (id) => {
    if (!window.confirm("Delete this demo video?")) {
      return;
    }

    await fetch(`${API}/api/demos/${id}`, { method: "DELETE" });
    loadDemos();
  };

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <div>
            <p className="small-title">ADMIN PANEL</p>
            <h1>Free Demo Videos 🎬</h1>
            <p>Add the free Keyboard and Flute demo class videos (YouTube links).</p>
          </div>
          <Link to="/admin/dashboard" className="logout-btn">
            ← Dashboard
          </Link>
        </div>

        <form className="admin-demo-form" onSubmit={saveDemo}>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="KEYBOARD">Keyboard</option>
            <option value="FLUTE">Flute</option>
          </select>

          <input
            type="text"
            name="title"
            placeholder="Title (example: Demo Class 1)"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="videoUrl"
            placeholder="YouTube link"
            value={form.videoUrl}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="sortOrder"
            placeholder="Order (1, 2, 3...)"
            value={form.sortOrder}
            onChange={handleChange}
          />

          <button type="submit" className="primary-btn">
            {editId ? "Update Demo" : "Add Demo"}
          </button>

          {editId && (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setEditId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="admin-demo-list">
          {demos.length === 0 && <p>No demo videos yet.</p>}

          {demos.map((demo) => (
            <div className="admin-demo-row" key={demo.id}>
              <div>
                <strong>
                  [{demo.category}] #{demo.sortOrder} {demo.title}
                </strong>
                <p>{demo.videoUrl}</p>
              </div>
              <div className="admin-demo-actions">
                <button type="button" className="secondary-btn" onClick={() => editDemo(demo)}>
                  Edit
                </button>
                <button type="button" className="logout-btn" onClick={() => deleteDemo(demo.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDemos;
